import { mergeAndDelayAndAdjustTimes } from '../solver.ts';
import { GpxSegment, TrackComposition } from '../../store/types.ts';
import { Mock } from 'vitest';

import { assembleTrackFromSegments } from '../helper/assembleTrackFromSegments.ts';
import { setParticipantsDelay } from '../../planner/store/trackMerge.reducer.ts';

vi.mock('../../utils/SimpleGPX.ts');
vi.mock('../helper/assembleTrackFromSegments.ts');

describe('with Peoples Solver', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('merge A1 and AB to A and B1 and AB to B - Shifting time based on people on track', () => {
        // given
        setParticipantsDelay(0.2);
        const gpxSegments: GpxSegment[] = [
            { id: '1', filename: 'A1', content: 'cA1' },
            { id: '2', filename: 'B1', content: 'cB1' },
            { id: '3', filename: 'AB', content: 'cAB' },
        ];
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['1', '3'], peopleCount: 2000 },
            { id: '2', name: 'B', segmentIds: ['2', '3'], peopleCount: 3000 },
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

    it('should merge A + B -> AB and AB + C -> ABC', () => {
        // given
        setParticipantsDelay(0.2);
        const gpxSegments: GpxSegment[] = [
            { id: '1', filename: 'A1', content: 'cA1' },
            { id: '2', filename: 'B1', content: 'cB1' },
            { id: '3', filename: 'AB', content: 'cAB' },
            { id: '4', filename: 'ABC', content: 'cABA' },
            { id: '5', filename: 'C1', content: 'cC1' },
        ];
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['1', '3', '4'], peopleCount: 3000 },
            { id: '2', name: 'B', segmentIds: ['2', '3', '4'], peopleCount: 1500 },
            { id: '3', name: 'C', segmentIds: ['5', '4'], peopleCount: 3000 },
        ];
        const arrivalDateTime = '2023-10-17T22:00:00.000Z';
        const arrivalDateTimePlus10 = '2023-10-17T22:10:00.000Z';
        const arrivalDateTimePlus15 = '2023-10-17T22:15:00.000Z';

        const dummyCalculatedTrack = { id: 'id', filename: 'file', content: 'content' };
        (assembleTrackFromSegments as Mock).mockImplementation(() => dummyCalculatedTrack);

        // when
        const calculatedTracks = mergeAndDelayAndAdjustTimes(gpxSegments, trackCompositions, arrivalDateTime);

        // then
        expect((assembleTrackFromSegments as Mock).mock.calls.map((call) => call[2])).toEqual([
            arrivalDateTime,
            arrivalDateTimePlus10,
            arrivalDateTimePlus15,
        ]);
        expect(assembleTrackFromSegments).toHaveBeenNthCalledWith(
            1,
            trackCompositions[0],
            gpxSegments,
            arrivalDateTime
        );
        expect(assembleTrackFromSegments).toHaveBeenNthCalledWith(
            2,
            trackCompositions[1],
            gpxSegments,
            arrivalDateTimePlus10
        );
        expect(assembleTrackFromSegments).toHaveBeenNthCalledWith(
            3,
            trackCompositions[2],
            gpxSegments,
            arrivalDateTimePlus15
        );
        expect(calculatedTracks).toEqual([dummyCalculatedTrack, dummyCalculatedTrack, dummyCalculatedTrack]);
    });
});
