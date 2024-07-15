import { calculateMerge } from './merge/MergeCalculation.ts';
import { AppDispatch } from '../store/store.ts';
import { calculateTrackStreetInfos } from './resolving/aggregate/calculateTrackStreetInfos.ts';
import { addPostCodeToStreetInfos } from './resolving/postcode/postCodeResolver.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';

const calculationThunk =
    (value: boolean) =>
    (dispatch: AppDispatch): Promise<void> => {
        dispatch(trackMergeActions.setIsCalculationRunning(value));
        return Promise.resolve();
    };

export const mergeAndGroupAndResolve = (dispatch: AppDispatch) => {
    console.log('magic happens');
    dispatch(calculationThunk(true)).then(() =>
        setTimeout(() => {
            dispatch(calculateMerge).then(() =>
                dispatch(calculateTrackStreetInfos).then(() =>
                    dispatch(addPostCodeToStreetInfos).then(() => dispatch(calculationThunk(false)))
                )
            );
        }, 10)
    );
};
