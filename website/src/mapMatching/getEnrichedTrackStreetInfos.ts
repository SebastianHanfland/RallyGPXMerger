import { getResolvedDistricts, getResolvedPostCodes, getTrackStreetInfos } from '../store/geoCoding.reducer.ts';
import { TrackStreetInfo, TrackWayPointType } from './types.ts';
import { getWayPointKey } from './postCodeResolver.ts';
import { createSelector } from '@reduxjs/toolkit';

export const getEnrichedTrackStreetInfos = createSelector(
    getTrackStreetInfos,
    getResolvedPostCodes,
    getResolvedDistricts,
    (trackStreetInfos, resolvedPostCodes, resolvedDistricts): TrackStreetInfo[] => {
        return trackStreetInfos.map((info) => ({
            ...info,
            wayPoints: info.wayPoints.map((wayPoint) => {
                const postCodeKey = getWayPointKey(wayPoint).postCodeKey;
                return {
                    ...wayPoint,
                    type: TrackWayPointType.Track,
                    postCode: resolvedPostCodes[postCodeKey],
                    district: resolvedDistricts[postCodeKey],
                };
            }),
        }));
    }
);
