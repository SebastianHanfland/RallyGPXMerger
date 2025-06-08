import { GeoPoint } from 'geo-distance-helper/dist/geoDistance';
import { Point } from './gpxTypes.ts';
import { ParsedPoint, TimedPoint } from '../planner/new-store/types.ts';

export const toLatLng = ({ lat, lon }: Omit<Point, 'time' | 'ele'>): GeoPoint => ({
    lat: typeof lat === 'string' ? Number(lat) : lat,
    lng: typeof lon === 'string' ? Number(lon) : lon,
});

export function getLatLng(point: ParsedPoint | TimedPoint) {
    return { lat: point.b, lng: point.l };
}
