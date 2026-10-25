import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadServerFile } from './loadServerFile';
import { setStartAndEndTime } from './loadFilesHook';
import { DisplayDispatch } from '../store/store';
import { displayMapActions } from '../store/displayMapReducer';

export function useLoadPlanningById(planningId: string | undefined) {
    const dispatch: DisplayDispatch = useDispatch();

    useEffect(() => {
        if (planningId) {
            dispatch(displayMapActions.setIsLoading(true));

            loadServerFile(planningId, dispatch).then(() => {
                dispatch(setStartAndEndTime);
                dispatch(displayMapActions.setIsLoading(false));
            });
        }
    }, [planningId]);
}
