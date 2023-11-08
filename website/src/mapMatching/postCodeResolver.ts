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
import { TrackWayPoint } from './types.ts';
import { geoCodingRequestsActions, getNumberOfPostCodeRequestsDone } from '../store/geoCodingRequests.reducer.ts';

export function getWayPointKey(wayPoint: TrackWayPoint) {
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
    dispatch(geoCodingRequestsActions.resetPostCodeRequestDoneCounter());

    let counter = 0;
    trackStreetInfos.forEach((trackStreetInfo, trackInfoIndex) => {
        trackStreetInfo.wayPoints.forEach(async (wayPoint, index) => {
            dispatch(geoCodingRequestsActions.increaseActivePostCodeRequestCounter());
            setTimeout(() => {
                const { lat, lon, postCodeKey } = getWayPointKey(wayPoint);
                if (!getResolvedPostCodes(getState())[postCodeKey]) {
                    fetchPostCodeForCoordinate(bigDataCloudKey)(lat, lon).then((postCode) => {
                        dispatch(geoCodingActions.saveResolvedPostCodes({ [postCodeKey]: postCode }));
                    });
                }
                dispatch(geoCodingRequestsActions.increasePostCodeRequestDoneCounter());
                dispatch(geoCodingRequestsActions.decreaseActivePostCodeRequestCounter());
                if (trackInfoIndex === trackStreetInfos.length - 1 && index === trackStreetInfo.wayPoints.length - 1) {
                    dispatch(geoCodingRequestsActions.setIsLoadingData(false));
                }
            }, 200 * counter);
            counter += 1;
        });
    });
};

export const getNumberOfPostCodeRequests = (state: State): number => {
    const trackStreetInfos = getTrackStreetInfos(state);

    let counter = 0;
    trackStreetInfos.forEach((trackStreetInfo) => {
        trackStreetInfo.wayPoints.forEach(() => {
            counter += 1;
        });
    });
    return counter;
};

export const getPostCodeRequestProgress = (state: State): undefined | number => {
    const numberOfRequiredRequests = getNumberOfPostCodeRequests(state);
    const numberOfRequestsDone = getNumberOfPostCodeRequestsDone(state);

    if (numberOfRequestsDone === 0 && numberOfRequiredRequests === 0) {
        return 0;
    }

    if (!!numberOfRequiredRequests && numberOfRequestsDone === numberOfRequiredRequests) {
        return 100;
    }

    return (numberOfRequestsDone / numberOfRequiredRequests) * 100;
};
