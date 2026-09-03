import { WayPoint, BlockedStreetInfo, BlockedStreetTrackUsage, StreetPathPoint, TrackWayPointType } from '../types.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { TrackComposition } from '../../../store/types.ts';

function takeLaterOne(end: string, to: string): string {
    return end >= to ? end : to;
}

function takeEarlierOne(start: string, from: string): string {
    return start <= from ? start : from;
}

function isKnown(value: string | null | undefined): value is string {
    return value !== null && value !== undefined && value.trim().length > 0;
}

function streetIdentityMatches(waypoint: WayPoint, info: BlockedStreetInfo) {
    return (
        isKnown(waypoint.streetName) &&
        isKnown(waypoint.postCode) &&
        isKnown(waypoint.district) &&
        isKnown(info.streetName) &&
        isKnown(info.postCode) &&
        isKnown(info.district) &&
        waypoint.streetName === info.streetName &&
        waypoint.postCode === info.postCode &&
        waypoint.district === info.district
    );
}

function addTrackId(tracksIds: string[], id: string) {
    if (tracksIds.includes(id)) {
        return tracksIds;
    }
    return [...tracksIds, id];
}

function addTrackUsage(usages: BlockedStreetTrackUsage[], usage: BlockedStreetTrackUsage) {
    const existing = usages.find((item) => item.trackId === usage.trackId);
    if (!existing) return [...usages, usage];
    return usages.map((item) =>
        item.trackId === usage.trackId
            ? {
                  ...item,
                  frontArrival: takeEarlierOne(item.frontArrival, usage.frontArrival),
                  backPassage: takeLaterOne(item.backPassage, usage.backPassage),
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

function countPeopleOnTracks(tracks: TrackComposition[], tracksIds: string[]): number {
    let counter = 0;
    tracks
        .filter((track) => tracksIds.includes(track.id))
        .forEach((track) => {
            counter += track.peopleCount ?? 0;
        });
    return counter;
}

function samePoint(first: StreetPathPoint | undefined, second: StreetPathPoint | undefined) {
    return first?.lat === second?.lat && first?.lon === second?.lon;
}

function samePath(first: StreetPathPoint[] | undefined, second: StreetPathPoint[] | undefined): boolean {
    if (!first || !second || first.length !== second.length) return false;
    return first.every((point, index) => samePoint(point, second[index]));
}

function reversePath(path: NonNullable<WayPoint['path']>) {
    return [...path].reverse();
}

function addStreetPath(paths: StreetPathPoint[][], path: WayPoint['path']): StreetPathPoint[][] {
    if (!path || path.length === 0) return paths;
    if (paths.some((existingPath) => samePath(existingPath, path) || samePath(existingPath, reversePath(path)))) {
        return paths;
    }

    const endingPathIndex = paths.findIndex((existingPath) =>
        samePoint(existingPath[existingPath.length - 1], path[0])
    );
    if (endingPathIndex >= 0) {
        return paths.map((existingPath, index) =>
            index === endingPathIndex ? [...existingPath, ...path.slice(1)] : existingPath
        );
    }

    const startingPathIndex = paths.findIndex((existingPath) => samePoint(path[path.length - 1], existingPath[0]));
    if (startingPathIndex >= 0) {
        return paths.map((existingPath, index) =>
            index === startingPathIndex ? [...path.slice(0, -1), ...existingPath] : existingPath
        );
    }

    return [...paths, path];
}

function getStreetPaths(info: BlockedStreetInfo): StreetPathPoint[][] {
    return info.paths ?? (info.path ? [info.path] : []);
}

export const getBlockedStreetInfo = createSelector(
    [getTrackStreetInfos, getTrackCompositions],
    (trackStreetInfos, tracks): BlockedStreetInfo[] => {
        let blockedStreetsInfo: BlockedStreetInfo[] = [];
        trackStreetInfos.forEach((trackStreetInfo) => {
            const foundTrack = tracks.find((track) => track.id === trackStreetInfo.id);
            trackStreetInfo.wayPoints
                .filter((wayPoint) => wayPoint.type === TrackWayPointType.Track)
                .forEach((waypoint) => {
                    if (!blockedStreetsInfo.find((info) => streetIdentityMatches(waypoint, info))) {
                        blockedStreetsInfo.push({
                            streetName: waypoint.streetName,
                            frontArrival: waypoint.frontArrival,
                            backPassage: waypoint.backPassage,
                            postCode: waypoint.postCode,
                            district: waypoint.district,
                            distanceInKm: waypoint.distanceInKm,
                            pointFrom: waypoint.pointFrom,
                            pointTo: waypoint.pointTo,
                            path: waypoint.path,
                            paths: waypoint.path ? [waypoint.path] : undefined,
                            peopleCount: 0,
                            tracksIds: [foundTrack!.id],
                            trackUsages: [
                                {
                                    trackId: foundTrack!.id,
                                    trackName: foundTrack!.name || foundTrack!.id,
                                    frontArrival: waypoint.frontArrival,
                                    backPassage: waypoint.backPassage,
                                    distanceInKm: waypoint.distanceInKm,
                                    speed: waypoint.speed,
                                },
                            ],
                        });
                        return;
                    }
                    blockedStreetsInfo = blockedStreetsInfo.map((info) =>
                        streetIdentityMatches(waypoint, info)
                            ? {
                                  ...info,
                                  backPassage: takeLaterOne(info.backPassage, waypoint.backPassage),
                                  frontArrival: takeEarlierOne(info.frontArrival, waypoint.frontArrival),
                                  tracksIds: addTrackId(info.tracksIds, foundTrack!.id),
                                  ...(() => {
                                      const paths = addStreetPath(getStreetPaths(info), waypoint.path);
                                      return {
                                          path: paths.length === 1 ? paths[0] : undefined,
                                          paths: paths.length > 0 ? paths : undefined,
                                      };
                                  })(),
                                  trackUsages: addTrackUsage(info.trackUsages ?? [], {
                                      trackId: foundTrack!.id,
                                      trackName: foundTrack!.name || foundTrack!.id,
                                      frontArrival: waypoint.frontArrival,
                                      backPassage: waypoint.backPassage,
                                      distanceInKm: waypoint.distanceInKm,
                                      speed: waypoint.speed,
                                  }),
                              }
                            : info
                    );
                });
        });

        return blockedStreetsInfo.map((info) => ({
            ...info,
            peopleCount: countPeopleOnTracks(tracks, info.tracksIds),
        }));
    }
);
