import { fetchPostCodeForCoordinate } from './fetchPostCodeForCoordinate.ts';
import {
    geoCodingActions,
    getBigDataCloudKey,
    getResolvedPostCodes,
    getTrackStreetInfos,
} from '../../../store/geoCoding.reducer.ts';
import { createSelector, Dispatch } from '@reduxjs/toolkit';
import { State } from '../../../store/types.ts';
import { fromKey, getWayPointKey } from '../helper/pointKeys.ts';
import { batch } from 'react-redux';

const getUniquePostCodeEntries = createSelector([getTrackStreetInfos], (infos) => {
    const uniquePostCodeKeys: string[] = [];

    infos?.forEach((info) =>
        info.wayPoints.forEach((wayPoint) => {
            const postCodeKey = getWayPointKey(wayPoint).postCodeKey;
            if (!uniquePostCodeKeys.includes(postCodeKey)) {
                uniquePostCodeKeys.push(postCodeKey);
            }
        })
    );
    return uniquePostCodeKeys;
});

export const getUnresolvedPostCodeEntries = (state: State) => {
    const uniquePostCodeEntries = getUniquePostCodeEntries(state);
    const postCodes = getResolvedPostCodes(state) ?? {};
    return uniquePostCodeEntries.filter(
        (postCodeKey) => postCodes[postCodeKey] === undefined || postCodes[postCodeKey] === -1
    );
};

async function fetchAndStorePostCodeAndDistrict(bigDataCloudKey: string, postCodeKey: string, dispatch: Dispatch) {
    const { lon, lat } = fromKey(postCodeKey);

    return fetchPostCodeForCoordinate(bigDataCloudKey)(lat, lon).then(({ postCode, district }) => {
        batch(() => {
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
    });
}

export const addPostCodeToStreetInfos = async (dispatch: Dispatch, getState: () => State) => {
    const bigDataCloudKey = getBigDataCloudKey(getState()) || 'bdc_649ce9cdfba14851ab77c6410ace035e';
    if (!bigDataCloudKey) {
        return Promise.resolve();
    }

    const unresolvedPostCodeKeys = getUnresolvedPostCodeEntries(getState());
    const postCodeRequests = unresolvedPostCodeKeys.map((postCodeKey) =>
        fetchAndStorePostCodeAndDistrict(bigDataCloudKey, postCodeKey, dispatch)
    );
    return Promise.all(postCodeRequests).then();
};

export const getPostCodeRequestProgress = createSelector(
    [getUniquePostCodeEntries, getResolvedPostCodes],
    (uniquePostCode, resolvedPostCodes) => {
        const numberOfUniquePostCodeEntries = uniquePostCode.length;
        const numberOfResolvedPostCodeEntries = Object.keys(resolvedPostCodes ?? {}).length;

        if (numberOfUniquePostCodeEntries === 0) {
            return 0;
        }

        return (numberOfResolvedPostCodeEntries / numberOfUniquePostCodeEntries) * 100;
    }
);
