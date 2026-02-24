import { WayPoint, BlockedStreetInfo, TrackWayPointType } from '../types.ts';
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

function streetAndPostCodeMatch(waypoint: WayPoint, info: BlockedStreetInfo) {
    return info.streetName === waypoint.streetName && info.postCode === waypoint.postCode;
}

function addTrackId(tracksIds: string[], id: string) {
    if (tracksIds.includes(id)) {
        return tracksIds;
    }
    return [...tracksIds, id];
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

export const getBlockedStreetInfo = createSelector(
    [getTrackStreetInfos, getTrackCompositions],
    (trackStreetInfos, tracks): BlockedStreetInfo[] => {
        let blockedStreetsInfo: BlockedStreetInfo[] = [];
        trackStreetInfos.forEach((trackStreetInfo) => {
            const foundTrack = tracks.find((track) => track.id === trackStreetInfo.id);
            trackStreetInfo.wayPoints
                .filter((wayPoint) => wayPoint.type === TrackWayPointType.Track)
                .forEach((waypoint) => {
                    if (!blockedStreetsInfo.find((info) => streetAndPostCodeMatch(waypoint, info))) {
                        blockedStreetsInfo.push({
                            streetName: waypoint.streetName,
                            frontArrival: waypoint.frontArrival,
                            backPassage: waypoint.backPassage,
                            postCode: waypoint.postCode,
                            district: waypoint.district,
                            distanceInKm: waypoint.distanceInKm,
                            pointFrom: waypoint.pointFrom,
                            pointTo: waypoint.pointTo,
                            peopleCount: 0,
                            tracksIds: [foundTrack!.id],
                        });
                        return;
                    }
                    blockedStreetsInfo = blockedStreetsInfo.map((info) =>
                        streetAndPostCodeMatch(waypoint, info)
                            ? {
                                  ...info,
                                  backPassage: takeLaterOne(info.backPassage, waypoint.backPassage),
                                  frontArrival: takeEarlierOne(info.frontArrival, waypoint.frontArrival),
                                  tracksIds: addTrackId(info.tracksIds, foundTrack!.id),
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
