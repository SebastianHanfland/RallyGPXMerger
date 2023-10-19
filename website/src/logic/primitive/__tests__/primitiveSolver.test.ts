import { mergeTracks } from '../primitiveSolver.ts';
import { CalculatedTrack, GpxSegment, TrackComposition } from '../../../store/types.ts';

describe('primitiveSolver', () => {
    it('merge A1 and AB to A and B1 and AB to B', () => {
        // given
        const gpxSegments: GpxSegment[] = [
            { id: '1', filename: 'A1', content: '', peopleCountStart: 1, peopleCountEnd: 1 },
            { id: '2', filename: 'B1', content: '', peopleCountStart: 1, peopleCountEnd: 1 },
            { id: '3', filename: 'AB', content: '', peopleCountStart: 2, peopleCountEnd: 2 },
        ];
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['1', '3'] },
            { id: '2', name: 'B', segmentIds: ['2', '3'] },
        ];
        const arrivalDateTime = '2023-10-17T22:00:00.000Z';

        const expectedCalculatedTracks: CalculatedTrack[] = [
            { id: '1', filename: 'A', content: '' },
            { id: '2', filename: 'B', content: '' },
        ];

        // when
        const calculatedTracks = mergeTracks(gpxSegments, trackCompositions, arrivalDateTime);

        // then
        expect(calculatedTracks).toEqual(expectedCalculatedTracks);
    });
});
