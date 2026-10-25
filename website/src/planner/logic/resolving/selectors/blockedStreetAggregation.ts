import {
    BlockedStreetInfo,
    BlockedStreetReference,
    BlockedStreetTrackUsage,
    StreetPathPoint,
    WayPoint,
} from '../types';
import { TrackComposition } from '../../../store/types';

const later = (a: string, b: string) => (a >= b ? a : b);
const earlier = (a: string, b: string) => (a <= b ? a : b);
const known = (value: string | null | undefined): value is string =>
    value !== null && value !== undefined && value.trim().length > 0;

export function streetIdentityMatches(waypoint: WayPoint, info: BlockedStreetInfo) {
    return (
        known(waypoint.streetName) &&
        known(waypoint.postCode) &&
        known(waypoint.district) &&
        known(info.streetName) &&
        known(info.postCode) &&
        known(info.district) &&
        waypoint.streetName === info.streetName &&
        waypoint.postCode === info.postCode &&
        waypoint.district === info.district
    );
}

export function addTrackUsage(usages: BlockedStreetTrackUsage[], usage: BlockedStreetTrackUsage) {
    const existing = usages.find((item) => item.trackId === usage.trackId);
    if (!existing) return [...usages, usage];
    return usages.map((item) =>
        item.trackId === usage.trackId
            ? {
                  ...item,
                  frontArrival: earlier(item.frontArrival, usage.frontArrival),
                  backPassage: later(item.backPassage, usage.backPassage),
                  distanceInKm:
                      item.distanceInKm === undefined && usage.distanceInKm === undefined
                          ? undefined
                          : (item.distanceInKm ?? 0) + (usage.distanceInKm ?? 0),
                  speed:
                      item.speed === undefined
                          ? usage.speed
                          : usage.speed === undefined
                            ? item.speed
                            : (item.speed + usage.speed) / 2,
              }
            : item
    );
}

export function addStreetReference(
    references: BlockedStreetReference[] | undefined,
    trackId: string,
    streetIndex: number | undefined
) {
    if (streetIndex === undefined) return references;
    if (references?.some((reference) => reference.trackId === trackId && reference.streetIndex === streetIndex))
        return references;
    return [...(references ?? []), { trackId, streetIndex }];
}

export function countPeopleOnTracks(tracks: TrackComposition[], tracksIds: string[]) {
    return tracks
        .filter((track) => tracksIds.includes(track.id))
        .reduce((count, track) => count + (track.peopleCount ?? 0), 0);
}

const samePoint = (first: StreetPathPoint | undefined, second: StreetPathPoint | undefined) =>
    first?.lat === second?.lat && first?.lon === second?.lon;
const samePath = (first: StreetPathPoint[] | undefined, second: StreetPathPoint[] | undefined) =>
    Boolean(
        first &&
        second &&
        first.length === second.length &&
        first.every((point, index) => samePoint(point, second[index]))
    );
const reversePath = (path: NonNullable<WayPoint['path']>) => [...path].reverse();

export function addStreetPath(paths: StreetPathPoint[][], path: WayPoint['path']): StreetPathPoint[][] {
    if (!path || path.length === 0) return paths;
    if (paths.some((existingPath) => samePath(existingPath, path) || samePath(existingPath, reversePath(path))))
        return paths;
    const endingPathIndex = paths.findIndex((existingPath) =>
        samePoint(existingPath[existingPath.length - 1], path[0])
    );
    if (endingPathIndex >= 0)
        return paths.map((existingPath, index) =>
            index === endingPathIndex ? [...existingPath, ...path.slice(1)] : existingPath
        );
    const startingPathIndex = paths.findIndex((existingPath) => samePoint(path[path.length - 1], existingPath[0]));
    if (startingPathIndex >= 0)
        return paths.map((existingPath, index) =>
            index === startingPathIndex ? [...path.slice(0, -1), ...existingPath] : existingPath
        );
    return [...paths, path];
}

export const getStreetPaths = (info: BlockedStreetInfo): StreetPathPoint[][] =>
    info.paths ?? (info.path ? [info.path] : []);
