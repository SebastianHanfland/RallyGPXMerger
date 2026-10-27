import { shiftDateBySeconds } from '../../../utils/dateUtil';
import { getStreetLookupIndex } from '../../../planner/logic/resolving/helper/getStreetLookupIndex';
import { ParsedPoint } from '../../../planner/store/types';
import { TrackWayPointType, WayPoint } from '../../../planner/logic/resolving/types';

export const extractLatLon = ({ b, l, t }: ParsedPoint, arrivalDate: string) => ({
    lat: b,
    lon: l,
    time: shiftDateBySeconds(arrivalDate, t),
});

export const extractPathPoint = (point: ParsedPoint) => ({
    lat: point.b,
    lon: point.l,
    s: getStreetLookupIndex(point),
});

export function getPreviousPoint(trackPoints: WayPoint[], arrivalDate: string): WayPoint {
    const wayPointsWithoutEntryPoints = trackPoints.filter((point) => point.type !== TrackWayPointType.Entry);
    if (wayPointsWithoutEntryPoints.length > 0) {
        return wayPointsWithoutEntryPoints[0];
    }
    return {
        streetName: null,
        postCode: null,
        district: null,
        frontArrival: arrivalDate,
        frontPassage: arrivalDate,
        backPassage: arrivalDate,
        pointFrom: { lat: 0, lon: 0, time: arrivalDate },
        pointTo: { lat: 0, lon: 0, time: arrivalDate },
    };
}
