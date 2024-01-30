import { AppDispatch } from '../../store/store.ts';
import { State } from '../../store/types.ts';
import { calculateTrackStreetInfos } from './aggregate/calculateTrackStreetInfos.ts';
import { addPostCodeToStreetInfos } from './postcode/postCodeResolver.ts';
import { resolveStreetNames } from './streets/mapMatchingStreetResolver.ts';

export const resolvePositions = (dispatch: AppDispatch, getState: () => State) => {
    const counter = resolveStreetNames(getState, dispatch);
    setTimeout(() => {
        dispatch(calculateTrackStreetInfos);
    }, 5000 * counter + 1000);
    setTimeout(() => {
        dispatch(addPostCodeToStreetInfos);
    }, 5000 * counter + 2000);
};
