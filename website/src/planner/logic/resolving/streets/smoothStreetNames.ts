import { ParsedPoint } from '../../../store/types.ts';
import { isSameStreetName } from './isSameStreetName.ts';

function getSmoothingStreetIndex(point: ParsedPoint): number {
    return point.m ?? point.r ?? point.s;
}

export const isJunction = (point: ParsedPoint, index: number, points: ParsedPoint[]): boolean => {
    if (points.length <= 1) {
        return false;
    }
    if (index === 0) {
        return getSmoothingStreetIndex(point) !== getSmoothingStreetIndex(points[1]);
    }
    if (index === points.length - 1) {
        return getSmoothingStreetIndex(point) !== getSmoothingStreetIndex(points[points.length - 2]);
    }
    const previousPoint = points[index - 1];
    const nextPoint = points[index + 1];

    return (
        getSmoothingStreetIndex(previousPoint) !== getSmoothingStreetIndex(point) &&
        getSmoothingStreetIndex(nextPoint) !== getSmoothingStreetIndex(point)
    );
};

function smoothJunction(point: ParsedPoint, index: number, points: ParsedPoint[]) {
    if (points.length <= 1) {
        return point;
    }
    if (index === 0) {
        return { ...point, s: points[1].s };
    }
    return { ...point, s: points[index - 1].s };
}

export const isSameStreet = (
    point: ParsedPoint,
    index: number,
    points: ParsedPoint[],
    streetLookUp: Record<number, string | undefined>
): boolean => {
    if (points.length <= 1 || index === 0) {
        return false;
    }

    const previousPoint = points[index - 1];
    const previousStreet = streetLookUp[getSmoothingStreetIndex(previousPoint)];
    const street = streetLookUp[getSmoothingStreetIndex(point)];

    return isSameStreetName(previousStreet, street);
};

function smoothSameStreet(
    point: ParsedPoint,
    index: number,
    points: ParsedPoint[],
    streetLookUp: Record<number, string | undefined>
) {
    if (points.length <= 1 || index === 0) {
        return point;
    }

    const previousPoint = points[index - 1];
    const previousStreet = streetLookUp[getSmoothingStreetIndex(previousPoint)];
    const street = streetLookUp[getSmoothingStreetIndex(point)];

    if (isSameStreetName(previousStreet, street)) {
        return { ...point, s: previousPoint.s };
    }
    return point;
}

const getCurrentPoints = (newPoints: ParsedPoint[], points: ParsedPoint[]): ParsedPoint[] => {
    return points.map((point, index) => (index < newPoints.length ? newPoints[index] : point));
};

export function smoothStreetNames(points: ParsedPoint[], streetLookUp: Record<number, string | undefined>) {
    const newPoints: ParsedPoint[] = [];

    points.forEach((point, index) => {
        const currentPoints = getCurrentPoints(newPoints, points);
        if (isJunction(point, index, currentPoints)) {
            newPoints.push(smoothJunction(point, index, currentPoints));
            return;
        }
        if (isSameStreet(point, index, currentPoints, streetLookUp)) {
            newPoints.push(smoothSameStreet(point, index, currentPoints, streetLookUp));
            return;
        }
        newPoints.push(point);
    });
    return newPoints;
}
