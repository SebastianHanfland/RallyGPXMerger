import { BREAK, SEGMENT, TrackBreak, TrackComposition, TrackElement } from '../../../../planner/store/types.ts';
import { findMultipleOccurrencesOfSegments, listAllNodesOfTracks, TrackNode } from '../nodeFinder.ts';

function getSegment(id: string) {
    return { id, segmentId: id, type: SEGMENT };
}

function getBreak(id: string, minutes: number): TrackBreak {
    return { id: id, type: BREAK, minutes: minutes, description: '', hasToilet: false };
}

describe('Node finder', () => {
    it('should find a node', () => {
        // given
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segments: ['0', '1', '3'].map(getSegment), peopleCount: 200 },
            { id: '2', name: 'B', segments: ['2', '3'].map(getSegment), peopleCount: 300 },
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
            {
                id: '1',
                name: 'A',
                segments: [getSegment('0'), getBreak('5', 20), getSegment('1'), getSegment('3')],
                peopleCount: 200,
            },
            { id: '2', name: 'B', segments: [getSegment('2'), getBreak('5', 20), getSegment('4')], peopleCount: 300 },
        ];

        const expectedTrackNodes: TrackNode[] = [];

        // when
        const nodesOfTracks = listAllNodesOfTracks(trackCompositions);

        // then
        expect(nodesOfTracks).toEqual(expectedTrackNodes);
    });

    it('should find a node when a track is a subset of another track', () => {
        // given
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segments: ['0', '1', '3'].map(getSegment), peopleCount: 200 },
            { id: '2', name: 'B', segments: ['3'].map(getSegment), peopleCount: 300 },
        ];

        const expectedTrackNodes: TrackNode[] = [
            {
                segmentsBeforeNode: [
                    { segmentId: '1', trackId: '1', amount: 200 },
                    { segmentId: '2', trackId: '2', amount: 300, trackIdInsteadOfSegmentId: true },
                ],
                segmentIdAfterNode: '3',
            },
        ];

        // when
        const nodesOfTracks = listAllNodesOfTracks(trackCompositions);

        // then
        expect(nodesOfTracks).toEqual(expectedTrackNodes);
    });

    describe('node finding regardless of breaks', () => {
        const getA = (segments: TrackElement[]) => ({
            id: '1',
            name: 'A',
            segments: segments,
            peopleCount: 200,
        });
        const getB = (segments: TrackElement[]) => ({
            id: '2',
            name: 'B',
            segments: segments,
            peopleCount: 300,
        });

        const testCases = [
            ...[
                { beforeA: [], beforeB: [] },
                { beforeA: [getBreak('2', 20)], beforeB: [] },
                { beforeA: [], beforeB: [getBreak('1', 15)] },
                { beforeA: [getBreak('2', 20)], beforeB: [getBreak('1', 15)] },
            ].flatMap(({ beforeA, beforeB }) => [
                {
                    description: `should find nodes when no breaks are present after merge ${beforeA} ${beforeB}`,
                    tracks: [
                        getA([getSegment('0'), ...beforeA, getSegment('1'), getSegment('3')]),
                        getB([getSegment('2'), ...beforeB, getSegment('1'), getSegment('3')]),
                    ],
                },
                {
                    description: `even if one track has a break on the shared path ${beforeA} ${beforeB}`,
                    tracks: [
                        getA([getSegment('0'), ...beforeA, getSegment('1'), getBreak('7', 5), getSegment('3')]),
                        getB([getSegment('2'), ...beforeB, getSegment('1'), getSegment('3')]),
                    ],
                },
                {
                    description: `even if the other track has a break on the shared path ${beforeA} ${beforeB}`,
                    tracks: [
                        getA([getSegment('0'), ...beforeA, getSegment('1'), getSegment('3')]),
                        getB([getSegment('2'), ...beforeB, getSegment('1'), getBreak('7', 5), getSegment('3')]),
                    ],
                },
                {
                    description: `even if both tracks have a break on the shared path ${beforeA} ${beforeB}`,
                    tracks: [
                        getA([getSegment('0'), ...beforeA, getSegment('1'), getBreak('7', 5), getSegment('3')]),
                        getB([getSegment('2'), ...beforeB, getSegment('1'), getBreak('7', 5), getSegment('3')]),
                    ],
                },
                {
                    description: `even if both tracks have a different id break on the shared path ${beforeA} ${beforeB}`,
                    tracks: [
                        getA([getSegment('0'), ...beforeA, getSegment('1'), getBreak('7', 5), getSegment('3')]),
                        getB([getSegment('2'), ...beforeB, getSegment('1'), getBreak('8', 5), getSegment('3')]),
                    ],
                },
                {
                    description: `even if both tracks have a different length break on the shared path ${beforeA} ${beforeB}`,
                    tracks: [
                        getA([getSegment('0'), ...beforeA, getSegment('1'), getBreak('7', 5), getSegment('3')]),
                        getB([getSegment('2'), ...beforeB, getSegment('1'), getBreak('9', 15), getSegment('3')]),
                    ],
                },
            ]),
        ];

        testCases.forEach(({ tracks, description }) =>
            it(description, () => {
                // when
                // then
                const expectedTrackNodes: TrackNode[] = [
                    {
                        segmentIdAfterNode: '1',
                        segmentsBeforeNode: [
                            { amount: 200, segmentId: '0', trackId: '1' },
                            { amount: 300, segmentId: '2', trackId: '2' },
                        ],
                    },
                ];

                // when
                const nodesOfTracks = listAllNodesOfTracks(tracks);

                // then
                expect(nodesOfTracks).toEqual(expectedTrackNodes);
            })
        );
    });

    it('should find two nodes, (first two branches then another)', () => {
        // given
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segments: ['A1', 'AB', 'ABC'].map(getSegment), peopleCount: 200 },
            { id: '2', name: 'B', segments: ['B1', 'AB', 'ABC'].map(getSegment), peopleCount: 300 },
            { id: '3', name: 'C', segments: ['C1', 'ABC'].map(getSegment), peopleCount: 400 },
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

    it('should find only one node when the segments are shared', () => {
        // given
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segments: ['A1', 'AB', 'ABC'].map(getSegment), peopleCount: 200 },
            { id: '2', name: 'B', segments: ['B1', 'AB', 'ABC'].map(getSegment), peopleCount: 300 },
        ];

        const expectedTrackNodes: TrackNode[] = [
            {
                segmentsBeforeNode: [
                    { segmentId: 'A1', trackId: '1', amount: 200 },
                    { segmentId: 'B1', trackId: '2', amount: 300 },
                ],
                segmentIdAfterNode: 'AB',
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
                { id: '1', name: 'A', segments: ['0', '1', '3'].map(getSegment) },
                { id: '2', name: 'B', segments: ['2', '3'].map(getSegment) },
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
                { id: '1', name: 'A', segments: ['0', '1', '3'].map(getSegment) },
                { id: '2', name: 'B', segments: ['2', '3'].map(getSegment) },
                { id: '3', name: 'C', segments: ['4', '3'].map(getSegment) },
                { id: '4', name: 'D', segments: ['5', '3'].map(getSegment) },
            ];

            const expectedTrackNodes: string[] = ['3'];

            // when
            const segmentIds = findMultipleOccurrencesOfSegments(trackCompositions);

            // then
            expect(segmentIds).toEqual(expectedTrackNodes);
        });
    });
});
