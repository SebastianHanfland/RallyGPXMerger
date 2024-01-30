import { TrackWayPoint } from '../types.ts';
import { toKey } from '../initializeResolvedPositions.ts';

export function getWayPointKey(wayPoint: TrackWayPoint) {
    const lat = (wayPoint.pointTo.lat + wayPoint.pointFrom.lat) / 2;
    const lon = (wayPoint.pointTo.lon + wayPoint.pointFrom.lon) / 2;
    const postCodeKey = toKey({ lat, lon });
    return { lat, lon, postCodeKey };
}
