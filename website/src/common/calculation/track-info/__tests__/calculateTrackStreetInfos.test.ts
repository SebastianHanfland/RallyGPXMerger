import { describe, expect, it } from 'vitest';
import { getWayPointsOfTrack } from '../calculateTrackStreetInfos.ts';
import { AggregatedPoints } from '../../../../planner/logic/resolving/types.ts';
import { BREAK, SEGMENT, ParsedGpxSegment, TrackBreak, TrackComposition } from '../../../../planner/store/types.ts';

function segment(id: string, streetIndex: number): { segment: ParsedGpxSegment; aggregated: AggregatedPoints[] } {
    const first = { l: 11, b: 48, e: 0, t: 0, s: streetIndex };
    const last = { l: 11.01, b: 48.01, e: 0, t: 60, s: streetIndex };
    return {
        segment: { id, filename: id, points: [first, last] },
        aggregated: [
            {
                frontArrival: 0,
                frontPassage: 60,
                pointFrom: first,
                pointTo: last,
                path: [first, last],
                distanceInKm: 1,
                speed: 60,
                s: streetIndex,
            },
        ],
    };
}

const lookups = {
    streets: { 1: 'Before Street', 2: 'After Street' },
    postCodes: {},
    districts: {},
};

describe('getWayPointsOfTrack street names', () => {
    it('uses a break override and otherwise inherits its neighboring street', () => {
        const before = segment('before', 1);
        const after = segment('after', 2);
        const breakElement: TrackBreak = {
            id: 'break',
            type: BREAK,
            minutes: 10,
            description: '',
            hasToilet: false,
            streetName: 'Break Location',
        };
        const track: TrackComposition = {
            id: 'track',
            segments: [
                { id: before.segment.id, type: SEGMENT, segmentId: before.segment.id },
                breakElement,
                { id: after.segment.id, type: SEGMENT, segmentId: after.segment.id },
            ],
        };

        const wayPoints = getWayPointsOfTrack(
            track,
            [before.segment, after.segment],
            [],
            0,
            lookups,
            '2025-06-01T10:00:00.000Z',
            { before: before.aggregated, after: after.aggregated }
        );

        expect(wayPoints.map(({ streetName, type }) => ({ streetName, type }))).toEqual([
            { streetName: 'Before Street', type: 'TRACK' },
            { streetName: 'Break Location', type: 'BREAK' },
            { streetName: 'After Street', type: 'TRACK' },
        ]);
    });

    it('uses a shared node override for the generated node waypoint', () => {
        const before = segment('before', 1);
        const after = segment('after', 2);
        const track: TrackComposition = {
            id: 'track',
            segments: [
                { id: before.segment.id, type: SEGMENT, segmentId: before.segment.id },
                { id: after.segment.id, type: SEGMENT, segmentId: after.segment.id },
            ],
        };

        const wayPoints = getWayPointsOfTrack(
            track,
            [before.segment, after.segment],
            [{ point: { lat: 48, lon: 11 }, tracks: [], segmentIdAfter: after.segment.id, streetName: 'Node Name' }],
            0,
            lookups,
            '2025-06-01T10:00:00.000Z',
            { before: before.aggregated, after: after.aggregated }
        );

        expect(wayPoints.find(({ type }) => type === 'NODE')).toMatchObject({
            streetName: 'Node Name',
            segmentAfterId: after.segment.id,
        });
    });
});
