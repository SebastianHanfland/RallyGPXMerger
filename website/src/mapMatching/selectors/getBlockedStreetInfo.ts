import { BlockedStreetInfo, TrackWayPoint } from '../types.ts';
import { getEnrichedTrackStreetInfos } from './getEnrichedTrackStreetInfos.ts';
import { createSelector } from '@reduxjs/toolkit';

function takeLaterOne(end: string, to: string): string {
    return end >= to ? end : to;
}

function takeEarlierOne(start: string, from: string): string {
    return start <= from ? start : from;
}

function streetAndPostCodeMatch(waypoint: TrackWayPoint, info: BlockedStreetInfo) {
    return info.streetName === waypoint.streetName && info.postCode === waypoint.postCode;
}

export const getBlockedStreetInfo = createSelector(
    getEnrichedTrackStreetInfos,
    (trackStreetInfos): BlockedStreetInfo[] => {
        let blockedStreetsInfo: BlockedStreetInfo[] = [];
        trackStreetInfos.forEach((trackStreetInfo) => {
            trackStreetInfo.wayPoints.forEach((waypoint) => {
                if (!blockedStreetsInfo.find((info) => streetAndPostCodeMatch(waypoint, info))) {
                    blockedStreetsInfo.push({
                        streetName: waypoint.streetName,
                        frontArrival: waypoint.frontArrival,
                        backPassage: waypoint.backArrival,
                        postCode: waypoint.postCode,
                        district: waypoint.district,
                        pointFrom: waypoint.pointFrom,
                        pointTo: waypoint.pointTo,
                    });
                    return;
                }
                blockedStreetsInfo = blockedStreetsInfo.map((info) =>
                    streetAndPostCodeMatch(waypoint, info)
                        ? {
                              ...info,
                              backPassage: takeLaterOne(info.backPassage, waypoint.backArrival),
                              frontArrival: takeEarlierOne(info.frontArrival, waypoint.frontArrival),
                          }
                        : info
                );
            });
        });

        return blockedStreetsInfo;
    }
);
