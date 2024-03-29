import { TrackWayPoint } from '../types.ts';

export function fromKey(key: string): { lat: number; lon: number } {
    const [lat, lon] = key.replace('lat:', '').replace('lng:', '').split('-');
    return { lat: Number(lat), lon: Number(lon) };
}
export function toKey({ lat, lon }: { lat: number; lon: number }): string {
    return `lat:${lat.toFixed(10)}-lng:${lon.toFixed(10)}`;
}

export function getWayPointKey(wayPoint: TrackWayPoint) {
    const lat = (wayPoint.pointTo.lat + wayPoint.pointFrom.lat) / 2;
    const lon = (wayPoint.pointTo.lon + wayPoint.pointFrom.lon) / 2;
    const postCodeKey = toKey({ lat, lon });
    return { lat, lon, postCodeKey };
}
