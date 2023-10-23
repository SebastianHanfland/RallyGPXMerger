import { mergeAndDelayAndAdjustTimes } from '../withPeoplesSolver.ts';
import { CalculatedTrack, GpxSegment, TrackComposition } from '../../../store/types.ts';
import { Mock } from 'vitest';
import { shiftEndDate } from '../../shiftEndDate.ts';
import { mergeSimpleGPXs, SimpleGPX } from '../../SimpleGPX.ts';
import { GpxFileAccess } from '../../types.ts';

vi.mock('../../gpxMerger.ts');
vi.mock('../../gpxTimeShifter.ts');
vi.mock('../../startTimeExtractor.ts');
vi.mock('../../shiftEndDate.ts');
vi.mock('../../SimpleGPX.ts');

describe('with Peoples Solver', () => {
    it('merge A1 and AB to A and B1 and AB to B - Ignoring People and Time shift', () => {
        function createMock(content: string): GpxFileAccess & { content: string } {
            return {
                getStart: () => `start-${content}`,
                toString: () => content,
                shiftToArrivalTime: vi.fn(),
                content,
            };
        }

        // given
        const a1Mock = createMock('a1');
        const b1Mock = createMock('b1');
        const abMock = createMock('ab');
        const aMock = createMock('cA');
        const bMock = createMock('cB');

        const gpxSegments: GpxSegment[] = [
            { id: '1', filename: 'A1', content: 'cA1', peopleCountEnd: 2000 },
            { id: '2', filename: 'B1', content: 'cB1', peopleCountEnd: 3000 },
            { id: '3', filename: 'AB', content: 'cAB' },
        ];
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['1', '3'] },
            { id: '2', name: 'B', segmentIds: ['2', '3'] },
        ];
        const arrivalDateTime = '2023-10-17T22:00:00.000Z';
        const arrivalDatePlus10 = 'arrivalDatePlus10';

        const expectedCalculatedTracks: CalculatedTrack[] = [
            { id: '1', filename: 'A', content: 'cA' },
            { id: '2', filename: 'B', content: 'cB' },
        ];
        (SimpleGPX.fromString as Mock).mockImplementation((content: string): GpxFileAccess => {
            switch (content) {
                case 'cA1':
                    return a1Mock;

                case 'cB1':
                    return b1Mock;

                case 'cAB':
                    return abMock;
                default:
                    expect({ content }).toBeUndefined();
            }
            return a1Mock;
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
        (shiftEndDate as Mock).mockImplementation((date: string, breakInMinutes: number) => {
            if (breakInMinutes === 0) {
                return arrivalDateTime;
            }
            if (breakInMinutes === 10 && date === arrivalDateTime) {
                return arrivalDatePlus10;
            }
            expect({ date, breakInMinutes }).toBeUndefined();
        });

        // when
        const calculatedTracks = mergeAndDelayAndAdjustTimes(gpxSegments, trackCompositions, arrivalDateTime);

        // then
        // expect(mockedSimpleGpx).toBeCalledWith();
        expect(abMock.shiftToArrivalTime).toHaveBeenNthCalledWith(1, arrivalDatePlus10);
        expect(a1Mock.shiftToArrivalTime).toHaveBeenCalledWith(abMock.getStart());
        expect(abMock.shiftToArrivalTime).toHaveBeenNthCalledWith(2, arrivalDateTime);
        expect(b1Mock.shiftToArrivalTime).toHaveBeenCalledWith(abMock.getStart());
        expect(shiftEndDate).toHaveBeenNthCalledWith(1, arrivalDateTime, 10);
        expect(shiftEndDate).toHaveBeenNthCalledWith(2, arrivalDateTime, 0);
        expect(calculatedTracks).toEqual(expectedCalculatedTracks);
    });
});
