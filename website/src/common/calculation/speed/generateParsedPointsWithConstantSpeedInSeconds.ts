import geoDistance from 'geo-distance-helper';
import { ParsedPoint } from '../../../planner/store/types.ts';
import { getLatLng } from '../../../utils/pointUtil.ts';

export function generateParsedPointsWithConstantSpeedInSeconds(
    speed: number,
    points: Omit<ParsedPoint, 't'>[]
): ParsedPoint[] {
    let previousPoint: ParsedPoint | undefined = undefined;

    return points.map((point, index, allPoints) => {
        if (index === 0) {
            previousPoint = { ...point, t: 0 };
            return { ...point, t: 0 };
        }
        const a = previousPoint as ParsedPoint;
        const b = allPoints[index];
        const distInKm = geoDistance(getLatLng(b), getLatLng(a)) as number;
        const time = speed > 0 ? Number((a.t + (60 * 60 * distInKm) / speed).toFixed(2)) : a.t;
        previousPoint = { ...point, t: time };
        return { ...point, t: time };
    });
}
