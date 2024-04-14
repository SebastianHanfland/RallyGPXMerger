import { getResolvedDistricts, getResolvedPostCodes, getTrackStreetInfos } from '../../../store/geoCoding.reducer.ts';
import { TrackStreetInfo, TrackWayPointType } from '../types.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getWayPointKey } from '../helper/pointKeys.ts';

export const getEnrichedTrackStreetInfos = createSelector(
    getTrackStreetInfos,
    getResolvedPostCodes,
    getResolvedDistricts,
    (trackStreetInfos, resolvedPostCodes, resolvedDistricts): TrackStreetInfo[] => {
        return trackStreetInfos.map((info) => ({
            ...info,
            wayPoints: info.wayPoints
                .map((wayPoint) => {
                    const postCodeKey = getWayPointKey(wayPoint).postCodeKey;
                    return {
                        ...wayPoint,
                        postCode: resolvedPostCodes[postCodeKey],
                        district: resolvedDistricts[postCodeKey],
                    };
                })
                .filter(
                    (wayPoint) => (wayPoint.distanceInKm ?? 0) > 0.001 || wayPoint.type !== TrackWayPointType.Track
                ),
        }));
    }
);
