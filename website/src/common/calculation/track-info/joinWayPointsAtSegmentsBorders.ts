import { TrackWayPointType, WayPoint } from '../../../planner/logic/resolving/types.ts';
import { isSameStreetName } from '../../../planner/logic/resolving/streets/isSameStreetName.ts';
import { getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';

function mergePoints(matchedWayPoint: WayPoint, matchedTrackPoint: WayPoint): WayPoint {
    const totalDistance = (matchedWayPoint.distanceInKm ?? 0) + (matchedTrackPoint.distanceInKm ?? 0);
    const totalTime = getTimeDifferenceInSeconds(matchedTrackPoint.frontPassage, matchedWayPoint.frontArrival);
    return {
        ...matchedTrackPoint,
        frontArrival: matchedWayPoint.frontArrival,
        pointFrom: matchedWayPoint.pointFrom,
        path: joinPaths(matchedWayPoint.path, matchedTrackPoint.path),
        distanceInKm: totalDistance,
        speed: totalTime > 0 ? (totalDistance / totalTime) * 3600 : 0,
    };
}

function joinPaths(first: WayPoint['path'], second: WayPoint['path']): WayPoint['path'] {
    if (!first) return second;
    if (!second) return first;
    const lastFirst = first[first.length - 1];
    const firstSecond = second[0];
    const secondWithoutDuplicate =
        lastFirst?.lat === firstSecond?.lat && lastFirst?.lon === firstSecond?.lon ? second.slice(1) : second;
    return [...first, ...secondWithoutDuplicate];
}

export function joinWayPointsAtSegmentsBorders(wayPoints: WayPoint[], trackPoints: WayPoint[]) {
    if (wayPoints.length > 0 && trackPoints.length > 0) {
        const lastWayPoint = wayPoints[wayPoints.length - 1];
        const firstTrackPoint = trackPoints[0];
        if (
            lastWayPoint.streetName !== null &&
            firstTrackPoint.streetName !== null &&
            isSameStreetName(lastWayPoint.streetName, firstTrackPoint.streetName) &&
            firstTrackPoint.type === TrackWayPointType.Track &&
            lastWayPoint.type == TrackWayPointType.Track
        ) {
            const matchedWayPoint = wayPoints[wayPoints.length - 1];
            const otherWayPoints = wayPoints.slice(0, wayPoints.length - 1);
            const otherTrackPoints = trackPoints.slice(1);
            const matchedTrackPoint = trackPoints[0];
            const mergedPoint = mergePoints(matchedWayPoint, matchedTrackPoint);
            return [...otherWayPoints, mergedPoint, ...otherTrackPoints];
        }
    }
    return [...wayPoints, ...trackPoints];
}
