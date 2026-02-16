import { TimedPoint } from '../../../store/types.ts';
import geoDistance from 'geo-distance-helper';
import { getLatLng } from '../../../../utils/pointUtil.ts';

export function calculateDistanceInKm(points: TimedPoint[]): number {
    let lastPoint: TimedPoint | null = null;
    let distance = 0;
    points.forEach((point) => {
        if (lastPoint === null) {
            lastPoint = point;
        } else {
            distance += geoDistance(getLatLng(point), getLatLng(lastPoint)) as number;
        }
        lastPoint = point;
    });
    return distance;
}
