import { ParsedPoint } from '../../../store/types.ts';
import { isSameStreetName } from './isSameStreetName.ts';

function getSmoothingStreetIndex(point: ParsedPoint): number {
    return point.m ?? point.r ?? point.s;
}

function getStreetNameParts(streetName: string | undefined): string[] {
    return (
        streetName
            ?.split(',')
            .map((part) => part.trim())
            .filter(Boolean) ?? []
    );
}

function getCommonStreetName(street1: string | undefined, street2: string | undefined): string | undefined {
    const street2Parts = new Set(getStreetNameParts(street2));
    return getStreetNameParts(street1).find((part) => street2Parts.has(part));
}

function getNextStreetLookupIndex(streetLookUp: Record<number, string | undefined>): number {
    return Math.max(0, ...Object.keys(streetLookUp).map(Number)) + 1;
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

function smoothCommonStreet(
    point: ParsedPoint,
    index: number,
    points: ParsedPoint[],
    streetLookUp: Record<number, string | undefined>,
    commonStreetName: string
): ParsedPoint {
    const previousPoint = points[index - 1];
    const previousRawStreetIndex = previousPoint.r;
    const currentRawStreetIndex = point.r;

    if (previousRawStreetIndex === undefined || currentRawStreetIndex === undefined) {
        return point;
    }

    const currentStreetName = streetLookUp[currentRawStreetIndex];
    const previousSmoothedStreetName = streetLookUp[previousPoint.s];

    if (previousPoint.s !== previousRawStreetIndex && previousSmoothedStreetName === commonStreetName) {
        return { ...point, s: previousPoint.s };
    }

    const mergedStreetIndex = getNextStreetLookupIndex(streetLookUp);
    streetLookUp[mergedStreetIndex] = commonStreetName;

    for (let pointIndex = index - 1; pointIndex >= 0; pointIndex -= 1) {
        const rawStreetIndex = points[pointIndex].r;
        if (
            rawStreetIndex === undefined ||
            getCommonStreetName(streetLookUp[rawStreetIndex], currentStreetName) !== commonStreetName
        ) {
            break;
        }
        points[pointIndex] = { ...points[pointIndex], s: mergedStreetIndex };
    }

    return { ...point, s: mergedStreetIndex };
}

const getCurrentPoints = (newPoints: ParsedPoint[], points: ParsedPoint[]): ParsedPoint[] => {
    return points.map((point, index) => (index < newPoints.length ? newPoints[index] : point));
};

export function smoothStreetNames(points: ParsedPoint[], streetLookUp: Record<number, string | undefined>) {
    const newPoints: ParsedPoint[] = [];

    points.forEach((point, index) => {
        const currentPoints = getCurrentPoints(newPoints, points);
        if (index > 0 && point.r !== undefined && currentPoints[index - 1].r !== undefined) {
            const previousStreet = streetLookUp[currentPoints[index - 1].r!];
            const street = streetLookUp[point.r];
            const commonStreetName = getCommonStreetName(previousStreet, street);

            if (point.r !== currentPoints[index - 1].r && commonStreetName !== undefined) {
                const smoothedPoint = smoothCommonStreet(point, index, currentPoints, streetLookUp, commonStreetName);
                currentPoints.slice(0, index).forEach((currentPoint, currentIndex) => {
                    newPoints[currentIndex] = currentPoint;
                });
                newPoints.push(smoothedPoint);
                return;
            }
        }

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
