import geoDistance from 'geo-distance-helper';
import { getLatLng, getLatLon } from './pointUtil.ts';

import { ParsedPoint } from '../planner/store/types.ts';

export const splitGpx = (
    points: ParsedPoint[],
    splitPoint: { lat: number; lng: number }
): [ParsedPoint[], ParsedPoint[]] => {
    let pointWithMinimalDistance: { lat: number; lon: number } | undefined = undefined;
    let minimalDistance: number = 999999999;
    points.forEach((point) => {
        const distance = geoDistance(getLatLng(point), splitPoint) as number;
        if (distance < minimalDistance) {
            minimalDistance = distance;
            pointWithMinimalDistance = getLatLon(point);
        }
    });
    console.log(pointWithMinimalDistance, splitPoint, minimalDistance);

    const pointsBefore: ParsedPoint[] = [];
    const pointsAfter: ParsedPoint[] = [];

    let splitPointReached = false;

    points.forEach((point) => {
        if (
            getLatLon(point).lat === pointWithMinimalDistance?.lat &&
            getLatLon(point).lon === pointWithMinimalDistance?.lon
        ) {
            splitPointReached = true;
            pointsBefore.push(point);
        }
        if (!splitPointReached) {
            pointsBefore.push(point);
        } else {
            pointsAfter.push(point);
        }
    });

    console.log({ pointsBefore, pointsAfter });
    return [pointsBefore, pointsAfter];
};
