import { describe, expect, it } from 'vitest';
import { calculateOverviewAccordionStatuses, getWarningAccordionDefinitions } from '../overviewStatus.ts';
import {
    ENTRY,
    GapPoint,
    PointOfInterest,
    PointOfInterestType,
    TrackComposition,
    TrackEntry,
} from '../../../../store/types.ts';
import type { TrackStreetInfo, WayPoint } from '../../../../logic/resolving/types.ts';

const createWayPoint = (streetName: string | null): WayPoint => ({
    streetName,
    postCode: '12345',
    district: 'District',
    frontArrival: '2025-06-01T10:00:00.000Z',
    frontPassage: '2025-06-01T10:01:00.000Z',
    backPassage: '2025-06-01T10:02:00.000Z',
    pointFrom: { lat: 0, lon: 0, time: '2025-06-01T10:00:00.000Z' },
    pointTo: { lat: 0, lon: 0, time: '2025-06-01T10:01:00.000Z' },
});

const createTrackInfo = (id: string, wayPoints: WayPoint[]): TrackStreetInfo => ({
    id,
    name: id,
    startFront: '2025-06-01T10:00:00.000Z',
    arrivalBack: '2025-06-01T10:02:00.000Z',
    arrivalFront: '2025-06-01T10:01:00.000Z',
    distanceInKm: 1,
    wayPoints,
});

const createTrack = (id: string, values: Partial<TrackComposition> = {}): TrackComposition => ({
    id,
    segments: [],
    ...values,
});

const createPoint = (type: PointOfInterestType, id: string): PointOfInterest => ({
    id,
    lat: 0,
    lng: 0,
    title: id,
    description: id,
    type,
    radiusInM: 1,
});

const createEntryPoint = (values: Partial<TrackEntry> = {}): TrackEntry => ({
    id: 'entry',
    type: ENTRY,
    streetName: 'Main Street',
    ...values,
});

const gap = {} as GapPoint;

describe('calculateOverviewAccordionStatuses', () => {
    it('marks every status as complete when no overview action is needed', () => {
        const statuses = calculateOverviewAccordionStatuses({
            tracks: [createTrack('track', { startName: 'Start', buffer: 0 })],
            trackStreetInfos: [createTrackInfo('track', [createWayPoint('Main Street')])],
            gaps: [],
            points: [],
            unknownStreetName: 'Unknown',
        });

        expect(getWarningAccordionDefinitions(statuses)).toEqual([]);
    });

    it('reports each warning-bearing accordion in overview order', () => {
        const statuses = calculateOverviewAccordionStatuses({
            tracks: [
                createTrack('unknown-street', { buffer: 0 }),
                createTrack('unconfigured', { startName: 'Start' }),
                createTrack('entry-track', {
                    startName: 'Start',
                    buffer: 0,
                    segments: [createEntryPoint({ streetName: '' })],
                }),
            ],
            trackStreetInfos: [
                createTrackInfo('unknown-street', [createWayPoint('Unknown')]),
                createTrackInfo('unconfigured', [createWayPoint('Main Street')]),
                createTrackInfo('entry-track', [createWayPoint('Main Street')]),
            ],
            gaps: [gap],
            points: [
                createPoint(PointOfInterestType.TODO, 'todo'),
                createPoint(PointOfInterestType.IMPEDIMENT, 'impediment'),
                createPoint(PointOfInterestType.TOILET, 'public'),
            ],
            unknownStreetName: 'Unknown',
        });

        expect(statuses.checks.unknownCount).toBe(1);
        expect(statuses.gaps.gapCount).toBe(1);
        expect(statuses.points).toMatchObject({
            todoCount: 1,
            impedimentCount: 1,
            pointCount: 3,
            publicPointCount: 1,
        });
        expect(statuses.start.unknownStartNameCount).toBe(1);
        expect(statuses.comStart.unconfiguredTrackCount).toBe(1);
        expect(statuses.entryPoints.incompleteEntryPointCount).toBe(1);
        expect(getWarningAccordionDefinitions(statuses).map(({ key }) => key)).toEqual([
            'checks',
            'gaps',
            'points',
            'start',
            'comStart',
            'entryPoints',
        ]);
    });
});
