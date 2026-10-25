import { BlockedStreetInfo, TrackWayPointType } from '../types';
import { createSelector } from '@reduxjs/toolkit';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos';
import { getTrackCompositions } from '../../../store/trackMerge.reducer';
import {
    addStreetPath,
    addStreetReference,
    addTrackUsage,
    countPeopleOnTracks,
    getStreetPaths,
    streetIdentityMatches,
} from './blockedStreetAggregation';

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
                            streetReferences: addStreetReference(undefined, foundTrack!.id, waypoint.s),
                        });
                        return;
                    }
                    blockedStreetsInfo = blockedStreetsInfo.map((info) =>
                        streetIdentityMatches(waypoint, info)
                            ? {
                                  ...info,
                                  backPassage:
                                      info.backPassage >= waypoint.backPassage
                                          ? info.backPassage
                                          : waypoint.backPassage,
                                  frontArrival:
                                      info.frontArrival <= waypoint.frontArrival
                                          ? info.frontArrival
                                          : waypoint.frontArrival,
                                  tracksIds: info.tracksIds.includes(foundTrack!.id)
                                      ? info.tracksIds
                                      : [...info.tracksIds, foundTrack!.id],
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
                                  streetReferences: addStreetReference(
                                      info.streetReferences,
                                      foundTrack!.id,
                                      waypoint.s
                                  ),
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
