import { fetchPostCodeForCoordinate } from './fetchPostCodeForCoordinate.ts';
import { geoCodingActions, getResolvedPostCodes, getTrackStreetInfos } from '../store/geoCoding.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import { toKey } from './initializeResolvedPositions.ts';

export const addPostCodeToStreetInfos = (dispatch: Dispatch, getState: () => State) => {
    const trackStreetInfos = getTrackStreetInfos(getState());

    let counter = 0;
    trackStreetInfos.forEach((trackStreetInfo) => {
        trackStreetInfo.wayPoints.forEach(async (wayPoint) => {
            setTimeout(() => {
                const lat = (wayPoint.pointTo.lat + wayPoint.pointFrom.lat) / 2;
                const lon = (wayPoint.pointTo.lon + wayPoint.pointFrom.lon) / 2;
                const postCodeKey = toKey({ lat, lon });
                if (!getResolvedPostCodes(getState())[postCodeKey]) {
                    fetchPostCodeForCoordinate('bdc_649ce9cdfba14851ab77c6410ace035e')(lat, lon).then((postCode) => {
                        dispatch(geoCodingActions.saveResolvedPostCodes({ [postCodeKey]: postCode }));
                    });
                }
            }, 200 * counter);
            counter += 1;
        });
    });
};
