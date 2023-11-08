import { fetchPostCodeForCoordinate } from './fetchPostCodeForCoordinate.ts';
import {
    geoCodingActions,
    getBigDataCloudKey,
    getResolvedPostCodes,
    getTrackStreetInfos,
} from '../store/geoCoding.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import { toKey } from './initializeResolvedPositions.ts';

export function getWayPointKey(wayPoint: {
    streetName: string;
    from: string;
    to: string;
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
    postCode?: number;
}) {
    const lat = (wayPoint.pointTo.lat + wayPoint.pointFrom.lat) / 2;
    const lon = (wayPoint.pointTo.lon + wayPoint.pointFrom.lon) / 2;
    const postCodeKey = toKey({ lat, lon });
    return { lat, lon, postCodeKey };
}

export const addPostCodeToStreetInfos = (dispatch: Dispatch, getState: () => State) => {
    const trackStreetInfos = getTrackStreetInfos(getState());
    const bigDataCloudKey = getBigDataCloudKey(getState()) || 'bdc_649ce9cdfba14851ab77c6410ace035e';
    if (!bigDataCloudKey) {
        return;
    }

    let counter = 0;
    trackStreetInfos.forEach((trackStreetInfo) => {
        trackStreetInfo.wayPoints.forEach(async (wayPoint) => {
            dispatch(geoCodingActions.increaseActivePostCodeRequestCounter());
            setTimeout(() => {
                const { lat, lon, postCodeKey } = getWayPointKey(wayPoint);
                if (!getResolvedPostCodes(getState())[postCodeKey]) {
                    fetchPostCodeForCoordinate(bigDataCloudKey)(lat, lon).then((postCode) => {
                        dispatch(geoCodingActions.saveResolvedPostCodes({ [postCodeKey]: postCode }));
                    });
                }
                dispatch(geoCodingActions.decreaseActivePostCodeRequestCounter());
            }, 200 * counter);
            counter += 1;
        });
    });
};
