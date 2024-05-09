import { calculateMerge } from './merge/MergeCalculation.ts';
import { AppDispatch } from '../store/store.ts';
import { calculateTrackStreetInfos } from './resolving/aggregate/calculateTrackStreetInfos.ts';
import { addPostCodeToStreetInfos } from './resolving/postcode/postCodeResolver.ts';

export const mergeAndGroupAndResolve = (dispatch: AppDispatch) => {
    console.log('magic happens');
    dispatch(calculateMerge).then(() =>
        dispatch(calculateTrackStreetInfos).then(() => dispatch(addPostCodeToStreetInfos))
    );
};
