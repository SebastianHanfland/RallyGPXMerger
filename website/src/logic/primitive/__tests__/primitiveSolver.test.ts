import { mergeAndAdjustTimes } from '../primitiveSolver.ts';
import { CalculatedTrack, GpxSegment, TrackComposition } from '../../../store/types.ts';
import { Mock } from 'vitest';
import { shiftEndDate } from '../../shiftEndDate.ts';
import { BREAK_IDENTIFIER, GpxFileAccess } from '../../types.ts';
import { mergeAndDelayAndAdjustTimes } from '../../withPeoples/withPeoplesSolver.ts';

import { letTimeInGpxEndAt } from '../../gpxTimeShifter.ts';
import { getStartTimeOfGpxTrack } from '../../startTimeExtractor.ts';
import { mergeSimpleGPXs, SimpleGPX } from '../../SimpleGPX.ts';

vi.mock('../../gpxMerger.ts');
vi.mock('../../gpxTimeShifter.ts');
vi.mock('../../startTimeExtractor.ts');
vi.mock('../../shiftEndDate.ts');
vi.mock('../../SimpleGPX.ts');

const solvers = [mergeAndAdjustTimes, mergeAndDelayAndAdjustTimes];

describe('primitiveSolver', () => {
    solvers.forEach((solver) =>
        describe(solver.name, () => {
            const arrivalDateTime = '2023-10-17T22:00:00.000Z';

            function createMock(content: string): GpxFileAccess & { content: string } {
                return {
                    getStart: () => `start-${content}`,
                    toString: () => content,
                    shiftToArrivalTime: vi.fn(),
                    content,
                };
            }

            // given
            const a1Mock = createMock('cA1');
            const a2Mock = createMock('cA2');
            const b1Mock = createMock('cB1');
            const abMock = createMock('cAB');
            const aMock = createMock('cA');
            const bMock = createMock('cB');

            beforeEach(() => {
                (shiftEndDate as Mock).mockImplementation((date: string, breakInMinutes: number) => {
                    if (breakInMinutes === 0) {
                        return arrivalDateTime;
                    }
                    expect({ date, breakInMinutes }).toBeUndefined();
                });

                (mergeSimpleGPXs as Mock).mockImplementation((list: GpxFileAccess[]) => {
                    if (list.length === 1) {
                        return list[0];
                    }
                    const a = list[0];
                    const b = list[1];
                    if (a.toString() === a1Mock.toString() && b.toString() === abMock.toString()) {
                        return aMock;
                    }
                    if (a.toString() === b1Mock.toString() && b.toString() === abMock.toString()) {
                        return bMock;
                    }
                    expect({ a: a, b: b }).toBeUndefined();
                });

                (SimpleGPX.fromString as Mock).mockImplementation((content: string): GpxFileAccess => {
                    switch (content) {
                        case 'cA1':
                            return a1Mock;
                        case 'cA2':
                            return a2Mock;

                        case 'cB1':
                            return b1Mock;

                        case 'cAB':
                            return abMock;
                        default:
                            expect({ content }).toBeUndefined();
                    }
                    return a1Mock;
                });
            });

            it('merge A1 and AB to A and B1 and AB to B - Ignoring People and Time shift', () => {
                // given
                const gpxSegments: GpxSegment[] = [
                    { id: '1', filename: 'A1', content: 'cA1' },
                    { id: '2', filename: 'B1', content: 'cB1' },
                    { id: '3', filename: 'AB', content: 'cAB' },
                ];
                const trackCompositions: TrackComposition[] = [
                    { id: '1', name: 'A', segmentIds: ['1', '3'] },
                    { id: '2', name: 'B', segmentIds: ['2', '3'] },
                ];

                const expectedCalculatedTracks: CalculatedTrack[] = [
                    { id: '1', filename: 'A', content: 'cA' },
                    { id: '2', filename: 'B', content: 'cB' },
                ];

                // Ignore time shifting within this test
                (letTimeInGpxEndAt as Mock).mockImplementation((content: string, _: string) => content);
                (getStartTimeOfGpxTrack as Mock).mockImplementation((_: string) => arrivalDateTime);

                // when
                const calculatedTracks = solver(gpxSegments, trackCompositions, arrivalDateTime);

                // then
                expect(calculatedTracks).toEqual(expectedCalculatedTracks);
            });

            it('should set arrival date for one segment - one track', () => {
                // given
                const gpxSegments: GpxSegment[] = [{ id: '1', filename: 'A1', content: 'cA1' }];
                const trackCompositions: TrackComposition[] = [{ id: '1', name: 'A', segmentIds: ['1'] }];

                const expectedCalculatedTracks: CalculatedTrack[] = [{ id: '1', filename: 'A', content: 'cA1' }];

                (letTimeInGpxEndAt as Mock).mockImplementation((content: string, date: string) => {
                    if (content === 'cA' && date === arrivalDateTime) {
                        return 'cA-shifted';
                    }
                    expect({ content, date }).toBeUndefined();
                });

                // when
                const calculatedTracks = solver(gpxSegments, trackCompositions, arrivalDateTime);

                // then
                expect(a1Mock.shiftToArrivalTime).toHaveBeenCalledWith(arrivalDateTime);
                expect(calculatedTracks).toEqual(expectedCalculatedTracks);
            });

            it('should set arrival date for two segments - one track', () => {
                // given
                const gpxSegments: GpxSegment[] = [
                    { id: '1', filename: 'A1', content: 'cA1' },
                    { id: '2', filename: 'AB', content: 'cAB' },
                ];
                const trackCompositions: TrackComposition[] = [{ id: '1', name: 'A', segmentIds: ['1', '2'] }];

                const expectedCalculatedTracks: CalculatedTrack[] = [{ id: '1', filename: 'A', content: 'cA' }];

                (letTimeInGpxEndAt as Mock).mockImplementation((content: string, date: string) => {
                    if (content === 'cA1' && date === 'start-cA2-shifted') {
                        return 'cA1-shifted';
                    }
                    if (content === 'cA2' && date === arrivalDateTime) {
                        return 'cA2-shifted';
                    }
                    expect({ content, date }).toBeUndefined();
                });
                (getStartTimeOfGpxTrack as Mock).mockImplementation((content: string) => {
                    switch (content) {
                        case 'cA2-shifted':
                            return 'start-cA2-shifted';
                        case 'cA1-shifted':
                            return 'irrelevant';
                        default:
                            expect({ content }).toBeUndefined();
                    }
                });
                (mergeSimpleGPXs as Mock).mockImplementation((list: GpxFileAccess[]) => {
                    const a = list[0];
                    const b = list[1];
                    if (a === a1Mock && b === abMock) {
                        return aMock;
                    }
                    if (a === b1Mock && b === abMock) {
                        return bMock;
                    }
                    expect({ a: a, b: b }).toBeUndefined();
                });

                // when
                const calculatedTracks = solver(gpxSegments, trackCompositions, arrivalDateTime);

                // then
                expect(calculatedTracks).toEqual(expectedCalculatedTracks);
            });

            it('should set arrival date for one segment and one break - one track', () => {
                // given
                const gpxSegments: GpxSegment[] = [{ id: '1', filename: 'A1', content: 'cA1' }];
                const trackCompositions: TrackComposition[] = [
                    { id: '1', name: 'A', segmentIds: ['1', `30${BREAK_IDENTIFIER}1`] },
                ];
                const arrivalDateTime30min = 'arrivalDateTime - 30min';

                const expectedCalculatedTracks: CalculatedTrack[] = [{ id: '1', filename: 'A', content: 'cA1' }];

                (letTimeInGpxEndAt as Mock).mockImplementation((content: string, date: string) => {
                    if (content === 'cA' && date === arrivalDateTime30min) {
                        return 'cA-shifted';
                    }
                    expect({ content, date }).toBeUndefined();
                });
                (shiftEndDate as Mock).mockImplementation((date: string, breakInMinutes: number) => {
                    if (date === arrivalDateTime && breakInMinutes === 30) {
                        return arrivalDateTime30min;
                    }
                    if (breakInMinutes === 0) {
                        return arrivalDateTime;
                    }
                    expect({ date, breakInMinutes }).toBeUndefined();
                });
                (getStartTimeOfGpxTrack as Mock).mockImplementation((_: string) => 'irrelevant');

                // when
                const calculatedTracks = solver(gpxSegments, trackCompositions, arrivalDateTime);

                // then
                expect(calculatedTracks).toEqual(expectedCalculatedTracks);
            });
        })
    );
});
