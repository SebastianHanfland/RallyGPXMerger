import { fetchPostCodeForCoordinate } from './fetchPostCodeForCoordinate.ts';
import { getBigDataCloudKey, getResolvedPostCodes, getTrackStreetInfos } from '../../../store/geoCoding.reducer.ts';
import { createSelector, Dispatch } from '@reduxjs/toolkit';
import { State } from '../../../store/types.ts';
import { getWayPointKey } from '../helper/pointKeys.ts';
import { batch } from 'react-redux';
import { segmentDataActions } from '../../../store/segmentData.redux.ts';

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

const correctionTuples: [string, string][] = [
    ['constituency for the Bundestag election ', ''],
    ['Bundestagswahlkreis ', ''],
    ['Wahlkreis ', ''],
    ['Munchen', 'München'],
    ['Munich', 'München'],
];

function correctDistrict(district: string): string {
    let correctDistrict = district;
    correctionTuples.forEach(([find, replacement]) => (correctDistrict = correctDistrict.replace(find, replacement)));
    return correctDistrict;
}

async function fetchAndStorePostCodeAndDistrict(
    bigDataCloudKey: string,
    streetIndex: number,
    dispatch: Dispatch,
    lat: number,
    lon: number
) {
    return fetchPostCodeForCoordinate(bigDataCloudKey)(lat, lon).then(({ postCode, district }) => {
        batch(() => {
            dispatch(segmentDataActions.addPostCodeLookup({ [streetIndex]: `${postCode}` }));
            if (district) {
                dispatch(segmentDataActions.addDistrictLookup({ [streetIndex]: correctDistrict(district) }));
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
