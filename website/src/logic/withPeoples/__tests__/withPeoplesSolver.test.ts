import { mergeAndDelayAndAdjustTimes } from '../withPeoplesSolver.ts';
import { GpxSegment, TrackComposition } from '../../../store/types.ts';
import { Mock } from 'vitest';

import { assembleTrackFromSegments } from '../../primitive/assembleTrackFromSegments.ts';
import { setParticipantsDelay } from '../../../store/trackMerge.reducer.ts';

vi.mock('../../SimpleGPX.ts');
vi.mock('../../primitive/assembleTrackFromSegments.ts');

describe('with Peoples Solver', () => {
    it('merge A1 and AB to A and B1 and AB to B - Shifting time based on people on track', () => {
        // given
        setParticipantsDelay(0.2);
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
        const arrivalDatePlus10 = '2023-10-17T22:10:00.000Z';

        const dummyCalculatedTrack = { id: 'id', filename: 'file', content: 'content' };
        (assembleTrackFromSegments as Mock).mockImplementation(() => dummyCalculatedTrack);

        // when
        const calculatedTracks = mergeAndDelayAndAdjustTimes(gpxSegments, trackCompositions, arrivalDateTime);

        // then
        expect(assembleTrackFromSegments).toHaveBeenNthCalledWith(
            1,
            trackCompositions[0],
            gpxSegments,
            arrivalDatePlus10
        );
        expect(assembleTrackFromSegments).toHaveBeenNthCalledWith(
            2,
            trackCompositions[1],
            gpxSegments,
            arrivalDateTime
        );
        expect(calculatedTracks).toEqual([dummyCalculatedTrack, dummyCalculatedTrack]);
    });
});
