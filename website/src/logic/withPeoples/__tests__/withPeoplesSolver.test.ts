import { mergeAndDelayAndAdjustTimes } from '../withPeoplesSolver.ts';
import { CalculatedTrack, GpxSegment, TrackComposition } from '../../../store/types.ts';
import { mergeGpxs } from '../../gpxMerger.ts';
import { Mock } from 'vitest';
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
            { id: '1', filename: 'A1', content: 'cA1', peopleCountEnd: 200 },
            { id: '2', filename: 'B1', content: 'cB1', peopleCountEnd: 300 },
            { id: '3', filename: 'AB', content: 'cAB' },
        ];
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['1', '3'] },
            { id: '2', name: 'B', segmentIds: ['2', '3'] },
        ];
        const arrivalDateTime = '2023-10-17T22:00:00.000Z';

        const expectedCalculatedTracks: CalculatedTrack[] = [
            { id: '1', filename: 'A', content: 'cA' },
            { id: '2', filename: 'B', content: 'cB' },
        ];
        (mergeGpxs as Mock).mockImplementation((a: string, b: string) => {
            if (a === 'cA1' && b === 'cAB') {
                return 'cA';
            }
            if (a === 'cB1' && b === 'cAB') {
                return 'cB';
            }
            expect({ a, b }).toBeUndefined();
        });
        // Ignore time shifting within this test
        (letTimeInGpxEndAt as Mock).mockImplementation((content: string, _: string) => content);
        (getStartTimeOfGpxTrack as Mock).mockImplementation((_: string) => arrivalDateTime);

        // when
        const calculatedTracks = mergeAndDelayAndAdjustTimes(gpxSegments, trackCompositions, arrivalDateTime);

        // then
        expect(calculatedTracks).toEqual(expectedCalculatedTracks);
    });
});
