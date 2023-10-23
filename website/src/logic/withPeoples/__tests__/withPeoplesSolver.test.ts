import { mergeAndDelayAndAdjustTimes } from '../withPeoplesSolver.ts';
import { CalculatedTrack, GpxSegment, TrackComposition } from '../../../store/types.ts';
import { Mock } from 'vitest';
import { shiftEndDate } from '../../shiftEndDate.ts';

import { mergeGpxs } from '../../gpxMerger.ts';
import { letTimeInGpxEndAt } from '../../gpxTimeShifter.ts';
import { getStartTimeOfGpxTrack } from '../../startTimeExtractor.ts';

vi.mock('../../gpxMerger.ts');
vi.mock('../../gpxTimeShifter.ts');
vi.mock('../../startTimeExtractor.ts');
vi.mock('../../shiftEndDate.ts');

describe('with Peoples Solver', () => {
    it('merge A1 and AB to A and B1 and AB to B - Ignoring People and Time shift', () => {
        // given
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
        (mergeGpxs as Mock).mockImplementation((a: string, b: string) => {
            if (a === 'cA1-shifted' && b === 'cAB-shifted-extra') {
                return 'cA';
            }
            if (a === 'cB1-shifted' && b === 'cAB-shifted') {
                return 'cB';
            }
            expect({ a, b }).toBeUndefined();
        });
        (letTimeInGpxEndAt as Mock).mockImplementation((content: string, date: string) => {
            if (content === 'cA1' && date === 'start-cAB-shifted-extra') {
                return 'cA1-shifted';
            }
            if (content === 'cB1' && date === 'start-cAB-shifted') {
                return 'cB1-shifted';
            }
            if (content === 'cAB' && date === arrivalDatePlus10) {
                return 'cAB-shifted-extra';
            }
            if (content === 'cAB' && date === arrivalDateTime) {
                return 'cAB-shifted';
            }
            expect({ content, date }).toBeUndefined();
        });
        (getStartTimeOfGpxTrack as Mock).mockImplementation((content: string) => {
            switch (content) {
                case 'cAB-shifted-extra':
                    return 'start-cAB-shifted-extra';
                case 'cAB-shifted':
                    return 'start-cAB-shifted';
                case 'cB1-shifted':
                    return 'start-cB1-shifted';
                case 'cA1-shifted':
                    return 'irrelevant';
                default:
                    expect({ content }).toBeUndefined();
            }
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
        expect(calculatedTracks).toEqual(expectedCalculatedTracks);
    });
});
