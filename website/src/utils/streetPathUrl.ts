import polyline from '@mapbox/polyline';
import { StreetPathPoint } from '../planner/logic/resolving/types.ts';
import { getBaseUrl } from './linkUtil.ts';

const POLYLINE_PRECISION = 5;
export const STREET_PATH_URL_LIMIT = 1900;

function encodePath(path: StreetPathPoint[]): string {
    return polyline.encode(
        path.map((point): [number, number] => [point.lat, point.lon]),
        POLYLINE_PRECISION
    );
}

function buildUrl(path: StreetPathPoint[], streetName?: string): string {
    const params = new URLSearchParams();
    params.set('streetpath', encodePath(path));
    if (streetName) {
        params.set('streetname', streetName);
    }
    return `${getBaseUrl()}?${params.toString()}`;
}

function removeConsecutiveDuplicates(path: StreetPathPoint[]): StreetPathPoint[] {
    return path.filter(
        (point, index) => index === 0 || point.lat !== path[index - 1].lat || point.lon !== path[index - 1].lon
    );
}

function distanceFromLineInMeters(point: StreetPathPoint, start: StreetPathPoint, end: StreetPathPoint): number {
    const metersPerLatitudeDegree = 110_540;
    const metersPerLongitudeDegree = 111_320 * Math.cos((point.lat * Math.PI) / 180);
    const startX = start.lon * metersPerLongitudeDegree;
    const startY = start.lat * metersPerLatitudeDegree;
    const endX = end.lon * metersPerLongitudeDegree;
    const endY = end.lat * metersPerLatitudeDegree;
    const pointX = point.lon * metersPerLongitudeDegree;
    const pointY = point.lat * metersPerLatitudeDegree;
    const deltaX = endX - startX;
    const deltaY = endY - startY;

    if (deltaX === 0 && deltaY === 0) {
        return Math.hypot(pointX - startX, pointY - startY);
    }

    const projection = Math.max(
        0,
        Math.min(1, ((pointX - startX) * deltaX + (pointY - startY) * deltaY) / (deltaX ** 2 + deltaY ** 2))
    );
    return Math.hypot(pointX - (startX + projection * deltaX), pointY - (startY + projection * deltaY));
}

export function simplifyStreetPath(path: StreetPathPoint[], toleranceInMeters: number): StreetPathPoint[] {
    if (path.length <= 2) return path;

    let furthestDistance = 0;
    let furthestIndex = 0;
    for (let index = 1; index < path.length - 1; index += 1) {
        const distance = distanceFromLineInMeters(
            pointAt(path, index),
            pointAt(path, 0),
            pointAt(path, path.length - 1)
        );
        if (distance > furthestDistance) {
            furthestDistance = distance;
            furthestIndex = index;
        }
    }

    if (furthestDistance <= toleranceInMeters) {
        return [pointAt(path, 0), pointAt(path, path.length - 1)];
    }

    const before = simplifyStreetPath(path.slice(0, furthestIndex + 1), toleranceInMeters);
    const after = simplifyStreetPath(path.slice(furthestIndex), toleranceInMeters);
    return [...before.slice(0, -1), ...after];
}

function pointAt(path: StreetPathPoint[], index: number): StreetPathPoint {
    return path[index]!;
}

export function createStreetPathUrl(path: StreetPathPoint[], streetName?: string): string {
    const normalizedPath = removeConsecutiveDuplicates(path);
    if (normalizedPath.length === 0) {
        return buildUrl([], streetName);
    }

    const exactUrl = buildUrl(normalizedPath, streetName);
    if (exactUrl.length <= STREET_PATH_URL_LIMIT || normalizedPath.length <= 2) {
        return exactUrl.length <= STREET_PATH_URL_LIMIT ? exactUrl : buildUrl(normalizedPath);
    }

    let lowerTolerance = 0;
    let upperTolerance = 1;
    let simplifiedPath = simplifyStreetPath(normalizedPath, upperTolerance);
    while (buildUrl(simplifiedPath, streetName).length > STREET_PATH_URL_LIMIT && simplifiedPath.length > 2) {
        lowerTolerance = upperTolerance;
        upperTolerance *= 2;
        simplifiedPath = simplifyStreetPath(normalizedPath, upperTolerance);
    }

    if (buildUrl(simplifiedPath, streetName).length <= STREET_PATH_URL_LIMIT) {
        for (let iteration = 0; iteration < 20; iteration += 1) {
            const tolerance = (lowerTolerance + upperTolerance) / 2;
            const candidate = simplifyStreetPath(normalizedPath, tolerance);
            if (buildUrl(candidate, streetName).length <= STREET_PATH_URL_LIMIT) {
                simplifiedPath = candidate;
                upperTolerance = tolerance;
            } else {
                lowerTolerance = tolerance;
            }
        }
    }

    const simplifiedUrl = buildUrl(simplifiedPath, streetName);
    return simplifiedUrl.length <= STREET_PATH_URL_LIMIT ? simplifiedUrl : buildUrl(simplifiedPath);
}

export function createStreetPointUrl(point: StreetPathPoint, locationName?: string): string {
    return createStreetPathUrl([point], locationName);
}

export function decodeStreetPath(encodedPath: string): StreetPathPoint[] | undefined {
    if (!encodedPath) return undefined;
    try {
        const decoded = polyline.decode(encodedPath, POLYLINE_PRECISION).map(([lat, lon]) => ({ lat, lon }));
        if (
            decoded.length === 0 ||
            decoded.some(
                ({ lat, lon }) =>
                    !Number.isFinite(lat) || !Number.isFinite(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180
            )
        ) {
            return undefined;
        }
        return decoded;
    } catch {
        return undefined;
    }
}
