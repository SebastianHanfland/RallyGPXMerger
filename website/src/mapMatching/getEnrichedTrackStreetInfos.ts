import { getResolvedDistricts, getResolvedPostCodes, getTrackStreetInfos } from '../planner/store/geoCoding.reducer.ts';
import { TrackStreetInfo } from './types.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getWayPointKey } from './postcode/wayPointKey.ts';

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
                    postCode: resolvedPostCodes[postCodeKey],
                    district: resolvedDistricts[postCodeKey],
                };
            }),
        }));
    }
);
