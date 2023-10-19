import { GpxSegment, TrackComposition } from '../../../store/types.ts';
import { listAllNodesOfTracks, TrackNode } from '../nodeFinder.ts';

describe('Node finder', () => {
    it('should find a node', () => {
        // given
        const gpxSegments: GpxSegment[] = [
            { id: '1', filename: 'A1', content: 'cA1', peopleCountEnd: 200 },
            { id: '2', filename: 'B1', content: 'cB1', peopleCountEnd: 300 },
            { id: '3', filename: 'AB', content: 'cAB' },
        ];
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['0', '1', '3'] },
            { id: '2', name: 'B', segmentIds: ['2', '3'] },
        ];

        const expectedTrackNodes: TrackNode[] = [
            {
                segmentsBeforeNode: [
                    { segmentId: 'A1', trackIds: ['1'], amount: 200 },
                    { segmentId: 'B1', trackIds: ['2'], amount: 300 },
                ],
                segmentIdAfterNode: '3',
            },
        ];

        // when
        const nodesOfTracks = listAllNodesOfTracks(trackCompositions, gpxSegments);

        // then
        expect(nodesOfTracks).toEqual(expectedTrackNodes);
    });
});
