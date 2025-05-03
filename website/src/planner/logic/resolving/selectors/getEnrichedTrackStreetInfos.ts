import {
    getDistrictReplacementWayPoints,
    getResolvedDistricts,
    getResolvedPostCodes,
    getStreetNameReplacementWayPoints,
    getTrackStreetInfos,
} from '../../../store/geoCoding.reducer.ts';
import { TrackStreetInfo, TrackWayPointType } from '../types.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getWayPointKey } from '../helper/pointKeys.ts';
import { overwriteWayPoints } from '../aggregate/overwriteWayPoints.ts';

export const getEnrichedTrackStreetInfos = createSelector(
    getTrackStreetInfos,
    getResolvedPostCodes,
    getResolvedDistricts,
    getDistrictReplacementWayPoints,
    getStreetNameReplacementWayPoints,
    (
        trackStreetInfos,
        resolvedPostCodes,
        resolvedDistricts,
        districtReplacements,
        streetReplacements
    ): TrackStreetInfo[] => {
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
