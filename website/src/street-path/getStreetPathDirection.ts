import { StreetPathPoint } from '../planner/logic/resolving/types.ts';

interface StreetPathDirection {
    position: StreetPathPoint;
    bearing: number;
}

function toRadians(value: number): number {
    return (value * Math.PI) / 180;
}

function distanceInMeters(from: StreetPathPoint, to: StreetPathPoint): number {
    const earthRadiusInMeters = 6_371_000;
    const latitudeDelta = toRadians(to.lat - from.lat);
    const longitudeDelta = toRadians(to.lon - from.lon);
    const fromLatitude = toRadians(from.lat);
    const toLatitude = toRadians(to.lat);
    const haversine =
        Math.sin(latitudeDelta / 2) ** 2 +
        Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;
    return earthRadiusInMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function getBearing(from: StreetPathPoint, to: StreetPathPoint): number {
    const fromLatitude = toRadians(from.lat);
    const toLatitude = toRadians(to.lat);
    const longitudeDelta = toRadians(to.lon - from.lon);
    const y = Math.sin(longitudeDelta) * Math.cos(toLatitude);
    const x =
        Math.cos(fromLatitude) * Math.sin(toLatitude) -
        Math.sin(fromLatitude) * Math.cos(toLatitude) * Math.cos(longitudeDelta);
    return (Math.atan2(y, x) * 180) / Math.PI + 360;
}

export function getStreetPathDirection(path: StreetPathPoint[]): StreetPathDirection | undefined {
    const segments = path.slice(1).map((point, index) => ({
        from: path[index]!,
        to: point,
        distance: distanceInMeters(path[index]!, point),
    }));
    const totalDistance = segments.reduce((sum, segment) => sum + segment.distance, 0);
    if (totalDistance === 0) return undefined;

    const targetDistance = totalDistance / 2;
    let coveredDistance = 0;
    const segment = segments.find((candidate) => {
        if (candidate.distance === 0) return false;
        if (coveredDistance + candidate.distance >= targetDistance) return true;
        coveredDistance += candidate.distance;
        return false;
    });
    if (!segment) return undefined;

    const progress = (targetDistance - coveredDistance) / segment.distance;
    return {
        position: {
            lat: segment.from.lat + (segment.to.lat - segment.from.lat) * progress,
            lon: segment.from.lon + (segment.to.lon - segment.from.lon) * progress,
        },
        bearing: getBearing(segment.from, segment.to) % 360,
    };
}
