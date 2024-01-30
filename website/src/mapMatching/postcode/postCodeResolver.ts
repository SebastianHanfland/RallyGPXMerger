import { fetchPostCodeForCoordinate } from './fetchPostCodeForCoordinate.ts';
import {
    geoCodingActions,
    getBigDataCloudKey,
    getResolvedPostCodes,
    getTrackStreetInfos,
} from '../../planner/store/geoCoding.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../../planner/store/types.ts';
import {
    geoCodingRequestsActions,
    getNumberOfPostCodeRequestsDone,
} from '../../planner/store/geoCodingRequests.reducer.ts';
import { getWayPointKey } from './wayPointKey.ts';

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
                if (
                    !getResolvedPostCodes(getState())[postCodeKey] ||
                    getResolvedPostCodes(getState())[postCodeKey] === -1
                ) {
                    fetchPostCodeForCoordinate(bigDataCloudKey)(lat, lon).then(({ postCode, district }) => {
                        dispatch(geoCodingActions.saveResolvedPostCodes({ [postCodeKey]: postCode }));
                        if (district) {
                            dispatch(
                                geoCodingActions.saveResolvedDistricts({
                                    [postCodeKey]: district
                                        .replace('constituency for the Bundestag election ', '')
                                        .replace('Bundestagswahlkreis ', '')
                                        .replace('Wahlkreis', '')
                                        .replace('Munchen', 'München')
                                        .replace('Munich', 'München'),
                                })
                            );
                        }
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
