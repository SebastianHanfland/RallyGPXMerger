import { TrackWayPointType, WayPoint } from '../../../../planner/logic/resolving/types.ts';
import { joinWayPointsAtSegmentsBorders } from '../joinWayPointsAtSegmentsBorders.ts';

function waypoint(path: WayPoint['path']): WayPoint {
    return {
        streetName: 'Main Street',
        postCode: '12345',
        district: 'District',
        frontArrival: '2025-01-01T10:00:00.000Z',
        frontPassage: '2025-01-01T10:01:00.000Z',
        backPassage: '2025-01-01T10:02:00.000Z',
        pointFrom: { ...path![0]!, time: '2025-01-01T10:00:00.000Z' },
        pointTo: { ...path![path!.length - 1]!, time: '2025-01-01T10:01:00.000Z' },
        path,
        distanceInKm: 1,
        type: TrackWayPointType.Track,
    };
}

describe('joinWayPointsAtSegmentsBorders', () => {
    it('concatenates street geometry and removes the duplicate seam point', () => {
        const first = waypoint([
            { lat: 48, lon: 11 },
            { lat: 48.1, lon: 11.1 },
        ]);
        const second = waypoint([
            { lat: 48.1, lon: 11.1 },
            { lat: 48.2, lon: 11.2 },
        ]);

        const result = joinWayPointsAtSegmentsBorders([first], [second]);

        expect(result[0].path).toEqual([
            { lat: 48, lon: 11 },
            { lat: 48.1, lon: 11.1 },
            { lat: 48.2, lon: 11.2 },
        ]);
    });
});
