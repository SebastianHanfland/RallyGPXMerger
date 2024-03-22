import { Point } from 'gpxparser';
import { GeoPoint } from 'geo-distance-helper/dist/geoDistance';

export const toLatLng = ({ lat, lon }: Omit<Point, 'time' | 'ele'>): GeoPoint => ({ lat, lng: lon });
