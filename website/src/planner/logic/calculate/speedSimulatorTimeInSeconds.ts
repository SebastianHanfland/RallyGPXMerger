import geoDistance from 'geo-distance-helper';

import { ParsedPoint } from '../../store/types.ts';

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

function getLatLngFromParsedPoint(b: Omit<ParsedPoint, 't'>) {
    return { lat: b.b, lng: b.l };
}

export function generateParsedPointsWithTimeInSeconds(avg: number, points: Omit<ParsedPoint, 't'>[]): ParsedPoint[] {
    const alpha = 0.15;
    let last_speed = avg;
    let previousPoint: ParsedPoint | undefined = undefined;

    return points.map((point, index, points) => {
        if (index === 0) {
            previousPoint = { ...point, t: 0 };
            return { ...point, t: 0 };
        }
        const a = previousPoint as ParsedPoint;
        const b = points[index];
        const distInKm = geoDistance(getLatLngFromParsedPoint(b), getLatLngFromParsedPoint(a)) as number;

        const slope = distInKm == 0 ? 0 : ((b.e - a.e) / (1000 * distInKm)) * 100;
        const slope_factor = slopeFactor(slope);

        const speed = alpha * (avg / slope_factor) + (1 - alpha) * last_speed;
        const time = Number((a.t + (60 * 60 * distInKm) / speed).toFixed(2));
        last_speed = speed;

        previousPoint = { ...point, t: time };
        return { ...point, t: time };
    });
}
