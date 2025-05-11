import { GeoPoint } from 'geo-distance-helper/dist/geoDistance';
import { Point } from './gpxTypes.ts';

export const toLatLng = ({ lat, lon }: Omit<Point, 'time' | 'ele'>): GeoPoint => ({
    lat: typeof lat === 'string' ? Number(lat) : lat,
    lng: typeof lon === 'string' ? Number(lon) : lon,
});
