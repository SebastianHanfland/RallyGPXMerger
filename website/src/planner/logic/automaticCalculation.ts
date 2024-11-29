import { calculateMerge } from './merge/MergeCalculation.ts';
import { AppDispatch } from '../store/store.ts';
import { calculateTrackStreetInfos } from './resolving/aggregate/calculateTrackStreetInfos.ts';
import { addPostCodeToStreetInfos } from './resolving/postcode/postCodeResolver.ts';
import { getIsCalculationOnTheFly, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { State } from '../store/types.ts';
import { successNotification } from '../store/toast.reducer.ts';
import { getMessages } from '../../lang/getMessages.ts';
import { backendActions } from '../store/backend.reducer.ts';

const calculationThunk =
    (value: boolean) =>
    (dispatch: AppDispatch): Promise<void> => {
        dispatch(trackMergeActions.setIsCalculationRunning(value));
        return Promise.resolve();
    };

export const calculateTracks = (dispatch: AppDispatch) => {
    dispatch(trackMergeActions.setHasChangesSinceLastCalculation(false));
    dispatch(calculationThunk(true)).then(() =>
        setTimeout(() => {
            dispatch(calculateMerge).then(() =>
                dispatch(calculateTrackStreetInfos).then(() =>
                    dispatch(addPostCodeToStreetInfos)
                        .then(() => dispatch(calculationThunk(false)))
                        .then(() =>
                            successNotification(
                                dispatch,
                                getMessages()['msg.calculation.success.title'],
                                getMessages()['msg.calculation.success.message']
                            )
                        )
                )
            );
        }, 10)
    );
    dispatch(backendActions.setHasChangesSinceLastUpload(true));
};

export const triggerAutomaticCalculation = (dispatch: AppDispatch, getState: () => State) => {
    const isCalculationOnTheFly = getIsCalculationOnTheFly(getState());
    if (isCalculationOnTheFly) {
        dispatch(calculateTracks);
    } else {
        dispatch(trackMergeActions.setHasChangesSinceLastCalculation(true));
    }
};
let constructTimeout: undefined | NodeJS.Timeout;

export function debounceConstructionOfTracks(dispatch: AppDispatch) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(triggerAutomaticCalculation);
    }, 500);
}
