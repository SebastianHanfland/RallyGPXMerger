import { describe, expect, it } from 'vitest';
import { getBranchNumbers } from '../../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';
import { listAllNodesOfTracks } from '../../../common/calculation/nodes/nodeFinder.ts';
import { BREAK, ENTRY, SEGMENT, TrackComposition, TrackElement, TrackSegment } from '../../store/types.ts';
import { TrackStreetInfo, TrackWayPointType, WayPoint } from '../../logic/resolving/types.ts';
import { buildFlowGraph } from '../flowGraph.ts';

const firstTime = '2025-01-01T10:00:00.000Z';

function getSegment(id: string): TrackSegment {
    return { id, segmentId: id, type: SEGMENT };
}

function getWayPoint(
    time: string,
    type: TrackWayPointType = TrackWayPointType.Track,
    values: Partial<WayPoint> = {}
): WayPoint {
    return {
        streetName: null,
        postCode: null,
        district: null,
        frontArrival: time,
        frontPassage: time,
        backPassage: time,
        pointFrom: { lat: 48, lon: 11, time },
        pointTo: { lat: 48, lon: 11, time },
        type,
        ...values,
    };
}

function getTrackInfo(id: string, wayPoints: WayPoint[], finishTime: string): TrackStreetInfo {
    return {
        id,
        name: id,
        startFront: wayPoints[0]!.frontArrival,
        arrivalFront: finishTime,
        arrivalBack: finishTime,
        distanceInKm: 1,
        wayPoints,
    };
}

function getGraph(tracks: TrackComposition[], trackInfos: TrackStreetInfo[]): ReturnType<typeof buildFlowGraph> {
    return buildFlowGraph(tracks, trackInfos, listAllNodesOfTracks(tracks), getBranchNumbers({}, tracks));
}

describe('flow graph', () => {
    it('creates a single flow from start to the common finish', () => {
        const tracks: TrackComposition[] = [
            { id: 'track-a', name: 'A', peopleCount: 20, segments: [getSegment('a-start'), getSegment('a-end')] },
        ];
        const graph = getGraph(tracks, [
            getTrackInfo(
                'track-a',
                [getWayPoint(firstTime), getWayPoint('2025-01-01T11:00:00.000Z')],
                '2025-01-01T11:00:00.000Z'
            ),
        ]);

        expect(graph).toMatchObject({ merges: [], finishGroupIds: ['track:track-a'] });
        expect(graph?.groups.find((group) => group.id === 'track:track-a')).toMatchObject({
            peopleCount: 20,
            startTime: Date.parse(firstTime),
            endTime: Date.parse('2025-01-01T11:00:00.000Z'),
        });
    });

    it('merges branches at the calculated latest incoming time', () => {
        const tracks: TrackComposition[] = [
            {
                id: 'track-a',
                name: 'A',
                color: '#ff0000',
                peopleCount: 10,
                segments: [getSegment('a'), getSegment('shared')],
            },
            {
                id: 'track-b',
                name: 'B',
                color: '#0000ff',
                peopleCount: 20,
                segments: [getSegment('b'), getSegment('shared')],
            },
        ];
        const graph = getGraph(tracks, [
            getTrackInfo(
                'track-a',
                [
                    getWayPoint(firstTime),
                    getWayPoint('2025-01-01T10:00:20.000Z', TrackWayPointType.Node),
                    getWayPoint('2025-01-01T10:01:00.000Z'),
                ],
                '2025-01-01T10:01:00.000Z'
            ),
            getTrackInfo(
                'track-b',
                [
                    getWayPoint(firstTime),
                    getWayPoint('2025-01-01T10:00:25.000Z', TrackWayPointType.Node),
                    getWayPoint('2025-01-01T10:01:00.000Z'),
                ],
                '2025-01-01T10:01:00.000Z'
            ),
        ]);

        expect(graph?.merges).toHaveLength(1);
        expect(graph?.merges[0]).toMatchObject({
            segmentIdAfterNode: 'shared',
            time: Date.parse('2025-01-01T10:00:25.000Z'),
        });
        expect(graph?.groups.find((group) => group.id === 'node:shared')).toMatchObject({
            trackIds: ['track-a', 'track-b'],
            peopleCount: 30,
            endTime: Date.parse('2025-01-01T10:01:00.000Z'),
            colorParts: [
                { trackId: 'track-a', color: '#ff0000' },
                { trackId: 'track-b', color: '#0000ff' },
            ],
        });
    });

    it('uses the effective branch size when a node specification reduces the output width', () => {
        const tracks: TrackComposition[] = [
            { id: 'track-a', name: 'A', peopleCount: 10, segments: [getSegment('a'), getSegment('shared')] },
            { id: 'track-b', name: 'B', peopleCount: 20, segments: [getSegment('b'), getSegment('shared')] },
        ];
        const branchNumbers = getBranchNumbers({ shared: { trackOffsets: { a: 0, b: 0 }, totalCount: 20 } }, tracks);
        const graph = buildFlowGraph(
            tracks,
            [
                getTrackInfo(
                    'track-a',
                    [getWayPoint(firstTime), getWayPoint('2025-01-01T10:01:00.000Z', TrackWayPointType.Node)],
                    '2025-01-01T10:01:00.000Z'
                ),
                getTrackInfo(
                    'track-b',
                    [getWayPoint(firstTime), getWayPoint('2025-01-01T10:01:00.000Z', TrackWayPointType.Node)],
                    '2025-01-01T10:01:00.000Z'
                ),
            ],
            listAllNodesOfTracks(tracks),
            branchNumbers
        );

        expect(graph?.groups.find((group) => group.id === 'node:shared')?.peopleCount).toBe(20);
    });

    it('extracts entry points and breaks as timed events', () => {
        const entryId = 'entry-1';
        const breakId = 'break-1';
        const tracks: TrackComposition[] = [
            {
                id: 'track-a',
                name: 'A',
                peopleCount: 10,
                segments: [
                    getSegment('start'),
                    { id: entryId, type: ENTRY, streetName: 'Entry Street' },
                    { id: breakId, type: BREAK, minutes: 5, description: '', hasToilet: false },
                    getSegment('end'),
                ] as TrackElement[],
            },
        ];
        const graph = getGraph(tracks, [
            getTrackInfo(
                'track-a',
                [
                    getWayPoint(firstTime),
                    getWayPoint('2025-01-01T10:00:10.000Z', TrackWayPointType.Entry, {
                        entryId,
                        frontPassage: '2025-01-01T10:00:12.000Z',
                    }),
                    getWayPoint('2025-01-01T10:00:20.000Z', TrackWayPointType.Break, {
                        breakId,
                        breakLength: 5,
                        frontPassage: '2025-01-01T10:00:25.000Z',
                    }),
                    getWayPoint('2025-01-01T10:01:00.000Z'),
                ],
                '2025-01-01T10:01:00.000Z'
            ),
        ]);

        expect(graph?.events).toEqual([
            expect.objectContaining({
                kind: 'entry',
                trackId: 'track-a',
                time: Date.parse('2025-01-01T10:00:10.000Z'),
            }),
            expect.objectContaining({
                kind: 'break',
                trackId: 'track-a',
                time: Date.parse('2025-01-01T10:00:20.000Z'),
                endTime: Date.parse('2025-01-01T10:00:25.000Z'),
                minutes: 5,
            }),
        ]);
    });

    it('connects tracks that never merge to the common finish', () => {
        const tracks: TrackComposition[] = [
            { id: 'track-a', peopleCount: 10, segments: [getSegment('a')] },
            { id: 'track-b', peopleCount: 20, segments: [getSegment('b')] },
        ];
        const graph = getGraph(tracks, [
            getTrackInfo(
                'track-a',
                [getWayPoint(firstTime), getWayPoint('2025-01-01T10:01:00.000Z')],
                '2025-01-01T10:01:00.000Z'
            ),
            getTrackInfo(
                'track-b',
                [getWayPoint(firstTime), getWayPoint('2025-01-01T10:02:00.000Z')],
                '2025-01-01T10:02:00.000Z'
            ),
        ]);

        expect(graph?.merges).toHaveLength(0);
        expect(graph?.finishGroupIds).toEqual(['track:track-a', 'track:track-b']);
        expect(graph?.groups.find((group) => group.id === 'finish')).toMatchObject({ peopleCount: 30 });
    });
});
