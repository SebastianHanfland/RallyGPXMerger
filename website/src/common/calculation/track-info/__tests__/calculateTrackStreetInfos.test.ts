import { describe, expect, it } from 'vitest';
import { calculateTrackStreetInfos, getWayPointsOfTrack } from '../calculateTrackStreetInfos';
import { AggregatedPoints } from '../../../../planner/logic/resolving/types';
import {
    BREAK,
    ENTRY,
    SEGMENT,
    ParsedGpxSegment,
    TrackBreak,
    TrackComposition,
    TrackEntry,
} from '../../../../planner/store/types';

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

    it('processes segments in track order and applies participant delay to back passage', () => {
        const first = segment('first', 1);
        const second = segment('second', 2);
        const track: TrackComposition = {
            id: 'track',
            peopleCount: 3,
            segments: [
                { id: first.segment.id, type: SEGMENT, segmentId: first.segment.id },
                { id: second.segment.id, type: SEGMENT, segmentId: second.segment.id },
            ],
        };

        const wayPoints = getWayPointsOfTrack(
            track,
            [first.segment, second.segment],
            [],
            10,
            lookups,
            '2025-06-01T10:00:00.000Z',
            { first: first.aggregated, second: second.aggregated }
        );

        expect(wayPoints.map(({ streetName }) => streetName)).toEqual(['Before Street', 'After Street']);
        expect(wayPoints[0].frontArrival).toBe('2025-06-01T09:58:00.000Z');
        expect(wayPoints[0].backPassage).toBe('2025-06-01T09:59:30.000Z');
    });

    it('uses the previous waypoint street when a break has no street override', () => {
        const before = segment('before', 1);
        const after = segment('after', 1);
        const breakElement: TrackBreak = {
            id: 'break',
            type: BREAK,
            minutes: 5,
            description: '',
            hasToilet: false,
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
            { streetName: 'Before Street', type: 'BREAK' },
            { streetName: 'Before Street', type: 'TRACK' },
        ]);
        expect(wayPoints[1].breakLength).toBe(5);
    });

    it('rounds an entry arrival while keeping its passage based on the unrounded arrival', () => {
        const route = segment('route', 1);
        const entry: TrackEntry = {
            id: 'entry',
            type: ENTRY,
            streetName: 'Start Street',
            buffer: 1,
            rounding: 5,
        };
        const track: TrackComposition = {
            id: 'track',
            segments: [entry, { id: route.segment.id, type: SEGMENT, segmentId: route.segment.id }],
        };

        const wayPoints = getWayPointsOfTrack(track, [route.segment], [], 0, lookups, '2025-06-01T10:00:00.000Z', {
            route: route.aggregated,
        });

        expect(wayPoints[0]).toMatchObject({
            type: 'ENTRY',
            streetName: 'Start Street',
            frontArrival: '2025-06-01T09:55:00.000Z',
            frontPassage: '2025-06-01T09:59:00.000Z',
            entryId: 'entry',
        });
    });

    it('skips a segment without aggregated street points', () => {
        const route = segment('route', 1);
        const track: TrackComposition = {
            id: 'track',
            segments: [{ id: route.segment.id, type: SEGMENT, segmentId: route.segment.id }],
        };

        const wayPoints = getWayPointsOfTrack(track, [route.segment], [], 0, lookups, '2025-06-01T10:00:00.000Z', {});

        expect(wayPoints).toEqual([]);
    });

    it('creates an empty track summary with valid fallback dates', () => {
        const [trackInfo] = calculateTrackStreetInfos(
            [],
            [{ id: 'track', name: 'Empty track', segments: [] }],
            lookups,
            0,
            [],
            '2025-06-01T10:00:00.000Z',
            [],
            undefined,
            {}
        );

        expect(trackInfo).toMatchObject({
            id: 'track',
            name: 'Empty track',
            distanceInKm: 0,
            wayPoints: [],
        });
        expect(() => new Date(trackInfo.startFront).toISOString()).not.toThrow();
        expect(() => new Date(trackInfo.arrivalBack).toISOString()).not.toThrow();
        expect(() => new Date(trackInfo.arrivalFront).toISOString()).not.toThrow();
    });
});
