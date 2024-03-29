import { AppDispatch } from '../../store/store.ts';
import { State } from '../../store/types.ts';
import { calculateTrackStreetInfos } from './aggregate/calculateTrackStreetInfos.ts';
import { addPostCodeToStreetInfos } from './postcode/postCodeResolver.ts';
import { resolveStreetNames } from './streets/mapMatchingStreetResolver.ts';

export const resolvePositions = async (dispatch: AppDispatch, getState: () => State) => {
    await resolveStreetNames(dispatch, getState);
    setTimeout(async () => {
        await dispatch(calculateTrackStreetInfos);
        setTimeout(async () => {
            await dispatch(addPostCodeToStreetInfos);
        }, 2000);
    }, 5000);
};
