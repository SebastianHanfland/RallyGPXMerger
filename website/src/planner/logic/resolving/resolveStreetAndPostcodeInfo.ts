import { AppDispatch } from '../../store/store.ts';
import { State } from '../../store/types.ts';
import { calculateTrackStreetInfos } from './aggregate/calculateTrackStreetInfos.ts';
import { addPostCodeToStreetInfos } from './postcode/postCodeResolver.ts';
import { resolveStreetNames } from './streets/mapMatchingStreetResolver.ts';
import { geoCodingRequestsActions } from '../../store/geoCodingRequests.reducer.ts';

export const resolvePositions = (dispatch: AppDispatch, getState: () => State) => {
    dispatch(geoCodingRequestsActions.setIsLoadingData(true));
    const counter = resolveStreetNames(dispatch, getState);
    setTimeout(() => {
        dispatch(calculateTrackStreetInfos);
    }, 5000 * counter + 1000);
    setTimeout(() => {
        dispatch(addPostCodeToStreetInfos);
    }, 5000 * counter + 2000);
};
