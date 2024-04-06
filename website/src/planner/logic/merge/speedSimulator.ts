import geoDistance from 'geo-distance-helper';
import { Point } from 'gpxparser';
import date from 'date-and-time';
import { toLatLng } from '../../../utils/pointUtil.ts';
import { getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';

function slopeFactor(slope: number): number {
    const max_slope = 100;
    slope = Math.max(-max_slope, Math.min(max_slope, slope));

    if (slope < -30) {
        return 1.5;
    } else if (slope < 0) {
        return 1 + ((2 * 0.7) / 13) * slope + (0.7 / Math.pow(13, 2)) * Math.pow(slope, 2);
    } else if (slope <= 20) {
        return 1 + Math.pow(slope / 7, 2);
    } else {
        return 10;
    }
}

export function generateTimeData(start: string, avg: number, points: Omit<Point, 'time'>[]): Point[] {
    const alpha = 0.15;
    let last_speed = avg;
    let previousPoint: Point | undefined = undefined;

    return points.map((point, index, points) => {
        if (index === 0) {
            previousPoint = { ...point, time: new Date(start) };
            return { ...point, time: new Date(start) };
        }
        const a = previousPoint as Point;
        const b = points[index];
        const distInKm = geoDistance(toLatLng(b), toLatLng(a)) as number;

        const slope = distInKm == 0 ? 0 : ((b.ele - a.ele) / (1000 * distInKm)) * 100;
        const slope_factor = slopeFactor(slope);

        const speed = alpha * (avg / slope_factor) + (1 - alpha) * last_speed;
        const time = new Date(date.addSeconds(a.time, (60 * 60 * distInKm) / speed));
        last_speed = speed;

        previousPoint = { ...point, time };
        return { ...point, time };
    });
}

export function calculateSpeed(points: Point[]): number {
    const startPoint = { ...points[0] };
    const endPoint = { ...points[points.length - 1] };

    let distance = 0;
    let lastPoint: Point | null = null;
    points.forEach((point) => {
        if (lastPoint) {
            distance += geoDistance(toLatLng(lastPoint), toLatLng(point)) as number;
        }
        lastPoint = point;
    });

    const timeInHours =
        getTimeDifferenceInSeconds(endPoint.time.toISOString(), startPoint.time.toISOString()) / 60 / 60;

    return distance / timeInHours;
}
