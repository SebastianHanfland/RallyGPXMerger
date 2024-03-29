import { fetchPostCodeForCoordinate } from './fetchPostCodeForCoordinate.ts';
import {
    geoCodingActions,
    getBigDataCloudKey,
    getResolvedPostCodes,
    getTrackStreetInfos,
} from '../../../store/geoCoding.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../../../store/types.ts';
import { geoCodingRequestsActions } from '../../../store/geoCodingRequests.reducer.ts';
import { fromKey, getWayPointKey } from '../helper/pointKeys.ts';

const getUniquePostCodeEntries = (state: State) => {
    const uniquePostCodeKeys: string[] = [];

    getTrackStreetInfos(state).forEach((info) =>
        info.wayPoints.forEach((wayPoint) => {
            const postCodeKey = getWayPointKey(wayPoint).postCodeKey;
            if (!uniquePostCodeKeys.includes(postCodeKey)) {
                uniquePostCodeKeys.push(postCodeKey);
            }
        })
    );
    return uniquePostCodeKeys;
};

export const getUnresolvedPostCodeEntries = (state: State) => {
    const uniquePostCodeEntries = getUniquePostCodeEntries(state);
    const postCodes = getResolvedPostCodes(state);
    return uniquePostCodeEntries.filter(
        (postCodeKey) => postCodes[postCodeKey] === undefined || postCodes[postCodeKey] === -1
    );
};

function fetchAndStorePostCodeAndDistrict(bigDataCloudKey: string, postCodeKey: string, dispatch: Dispatch) {
    const { lon, lat } = fromKey(postCodeKey);

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

export const addPostCodeToStreetInfos = (dispatch: Dispatch, getState: () => State) => {
    const bigDataCloudKey = getBigDataCloudKey(getState()) || 'bdc_649ce9cdfba14851ab77c6410ace035e';
    if (!bigDataCloudKey) {
        return;
    }

    let counter = 0;
    const unresolvedPostCodeKeys = getUnresolvedPostCodeEntries(getState());
    console.log('There are unresolced: ', unresolvedPostCodeKeys);
    unresolvedPostCodeKeys.forEach(async (postCodeKey, index) => {
        setTimeout(() => {
            fetchAndStorePostCodeAndDistrict(bigDataCloudKey, postCodeKey, dispatch);
            if (index === unresolvedPostCodeKeys.length - 1) {
                dispatch(geoCodingRequestsActions.setIsLoadingData(false));
            }
        }, 200 * counter);
        counter += 1;
    });
};

export const getPostCodeRequestProgress = (state: State): undefined | number => {
    const numberOfUniquePostCodeEntries = getUniquePostCodeEntries(state).length;
    const numberOfResolvedPostCodeEntries = Object.keys(getResolvedPostCodes(state)).length;

    if (numberOfUniquePostCodeEntries === 0) {
        return 0;
    }

    return (numberOfResolvedPostCodeEntries / numberOfUniquePostCodeEntries) * 100;
};
