import { ParsedPoint } from '../../../store/types.ts';

export const isJunction = (point: ParsedPoint, index: number, points: ParsedPoint[]): boolean => {
    if (points.length <= 1) {
        return false;
    }
    if (index === 0) {
        return point.s !== points[1].s;
    }
    if (index === points.length - 1) {
        return point.s !== points[points.length - 2].s;
    }
    const previousPoint = points[index - 1];
    const nextPoint = points[index + 1];

    return previousPoint.s !== point.s && nextPoint.s !== point.s;
};

function smoothJunction(point: ParsedPoint, index: number, points: ParsedPoint[]) {
    if (points.length <= 1) {
        return point;
    }
    if (index === 0) {
        return { ...point, s: points[1].s, o: point.s };
    }
    return { ...point, s: points[index - 1].s, o: point.s };
}

const getCurrentPoints = (newPoints: ParsedPoint[], points: ParsedPoint[]): ParsedPoint[] => {
    return points.map((point, index) => (index < newPoints.length ? newPoints[index] : point));
};

export function smoothStreetNames(points: ParsedPoint[], streetLookUp: Record<number, string>) {
    // When there is only one entry, replace it
    const occurrenceCount: Record<number, number> = {};
    points.forEach((point) => {
        occurrenceCount[point.s] = (occurrenceCount[point.s] ?? 0) + 1;
    });
    console.log(occurrenceCount);

    const newPoints: ParsedPoint[] = [];

    points.forEach((point, index) => {
        const currentPoints = getCurrentPoints(newPoints, points);
        if (isJunction(point, index, currentPoints)) {
            newPoints.push(smoothJunction(point, index, currentPoints));
            return;
        }
        newPoints.push(point);
    });
    return newPoints;
}
