import { TrackComposition } from '../../../store/types.ts';
import { findMultipleOccurrencesOfSegments, listAllNodesOfTracks, TrackNode } from '../nodeFinder.ts';
import { BREAK_IDENTIFIER } from '../../types.ts';

describe('Node finder', () => {
    it('should find a node', () => {
        // given
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['0', '1', '3'], peopleCount: 200 },
            { id: '2', name: 'B', segmentIds: ['2', '3'], peopleCount: 300 },
        ];

        const expectedTrackNodes: TrackNode[] = [
            {
                segmentsBeforeNode: [
                    { segmentId: '1', trackId: '1', amount: 200 },
                    { segmentId: '2', trackId: '2', amount: 300 },
                ],
                segmentIdAfterNode: '3',
            },
        ];

        // when
        const nodesOfTracks = listAllNodesOfTracks(trackCompositions);

        // then
        expect(nodesOfTracks).toEqual(expectedTrackNodes);
    });

    it('track finder ignore break nodes', () => {
        // given
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['0', `20${BREAK_IDENTIFIER}1`, '1', '3'], peopleCount: 200 },
            { id: '2', name: 'B', segmentIds: ['2', `20${BREAK_IDENTIFIER}1`, '4'], peopleCount: 300 },
        ];

        const expectedTrackNodes: TrackNode[] = [];

        // when
        const nodesOfTracks = listAllNodesOfTracks(trackCompositions);

        // then
        expect(nodesOfTracks).toEqual(expectedTrackNodes);
    });

    it('should find two nodes, (first two branches then another)', () => {
        // given
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['A1', 'AB', 'ABC'], peopleCount: 200 },
            { id: '2', name: 'B', segmentIds: ['B1', 'AB', 'ABC'], peopleCount: 300 },
            { id: '3', name: 'C', segmentIds: ['C1', 'ABC'], peopleCount: 400 },
        ];

        const expectedTrackNodes: TrackNode[] = [
            {
                segmentsBeforeNode: [
                    { segmentId: 'A1', trackId: '1', amount: 200 },
                    { segmentId: 'B1', trackId: '2', amount: 300 },
                ],
                segmentIdAfterNode: 'AB',
            },
            {
                segmentsBeforeNode: [
                    { segmentId: 'AB', trackId: '1', amount: 200 },
                    { segmentId: 'AB', trackId: '2', amount: 300 },
                    { segmentId: 'C1', trackId: '3', amount: 400 },
                ],
                segmentIdAfterNode: 'ABC',
            },
        ];

        // when
        const nodesOfTracks = listAllNodesOfTracks(trackCompositions);

        // then
        expect(nodesOfTracks).toEqual(expectedTrackNodes);
    });

    describe('findMultipleOccurrencesOfSegments', () => {
        it('should find segments occurring in multiple tracks', () => {
            // given
            const trackCompositions: TrackComposition[] = [
                { id: '1', name: 'A', segmentIds: ['0', '1', '3'] },
                { id: '2', name: 'B', segmentIds: ['2', '3'] },
            ];

            const expectedTrackNodes: string[] = ['3'];

            // when
            const segmentIds = findMultipleOccurrencesOfSegments(trackCompositions);

            // then
            expect(segmentIds).toEqual(expectedTrackNodes);
        });

        it('should find a node of more than 2 tracks', () => {
            // given
            const trackCompositions: TrackComposition[] = [
                { id: '1', name: 'A', segmentIds: ['0', '1', '3'] },
                { id: '2', name: 'B', segmentIds: ['2', '3'] },
                { id: '3', name: 'C', segmentIds: ['4', '3'] },
                { id: '4', name: 'D', segmentIds: ['5', '3'] },
            ];

            const expectedTrackNodes: string[] = ['3'];

            // when
            const segmentIds = findMultipleOccurrencesOfSegments(trackCompositions);

            // then
            expect(segmentIds).toEqual(expectedTrackNodes);
        });
    });
});
