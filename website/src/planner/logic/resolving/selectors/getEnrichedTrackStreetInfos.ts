import {
    getDistrictReplacementWayPoints,
    getStreetNameReplacementWayPoints,
} from '../../../store/geoCoding.reducer.ts';
import { TrackStreetInfo, TrackWayPointType } from '../types.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getWayPointKey } from '../helper/pointKeys.ts';
import { overwriteWayPoints } from '../aggregate/overwriteWayPoints.ts';

export const getEnrichedTrackStreetInfos = createSelector(
    getDistrictReplacementWayPoints,
    getStreetNameReplacementWayPoints,
    (districtReplacements, streetReplacements): TrackStreetInfo[] => {
        const trackStreetInfos: TrackStreetInfo[] = [];
        const resolvedPostCodes = null;
        const resolvedDistricts = null;

        const overwrites: Record<string, string> = {};
        districtReplacements?.forEach((replacement) => {
            overwrites[getWayPointKey(replacement).postCodeKey] = replacement.district;
        });
        return (trackStreetInfos ?? []).map((info) => ({
            ...info,
            wayPoints: overwriteWayPoints(info.wayPoints, streetReplacements ?? [])
                .map((wayPoint) => {
                    const postCodeKey = getWayPointKey(wayPoint).postCodeKey;

                    return {
                        ...wayPoint,
                        postCode: (resolvedPostCodes ?? {})[postCodeKey],
                        district: overwrites[postCodeKey]
                            ? overwrites[postCodeKey]
                            : (resolvedDistricts ?? {})[postCodeKey],
                    };
                })
                .filter(
                    (wayPoint) => (wayPoint.distanceInKm ?? 0) > 0.001 || wayPoint.type !== TrackWayPointType.Track
                ),
        }));
    }
);
