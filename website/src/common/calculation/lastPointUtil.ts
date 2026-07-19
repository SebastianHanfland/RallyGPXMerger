import { ParsedGpxSegment, ParsedPoint } from '../../planner/store/types.ts';

export function getPointsEndingAtTime(gpxOrBreak: ParsedGpxSegment, endTime: number): ParsedPoint[] {
    const points = gpxOrBreak.points;
    if (points.length === 0) {
        return [];
    }
    const secondsOfSegment = points[points.length - 1].t;

    return points.map((point) => ({ ...point, t: endTime + (point.t - secondsOfSegment) }));
}
