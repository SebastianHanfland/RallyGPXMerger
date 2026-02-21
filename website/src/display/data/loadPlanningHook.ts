import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadServerFile } from './loadServerFile.ts';
import { setStartAndEndTime } from './loadFilesHook.ts';
import { DisplayDispatch } from '../store/store.ts';
import { displayMapActions } from '../store/displayMapReducer.ts';

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
