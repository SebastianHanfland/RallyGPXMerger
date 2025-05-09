import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { displayTracksActions } from '../store/displayTracksReducer.ts';
import { loadServerFile } from './loadServerFile.ts';
import { setStartAndEndTime } from './loadFilesHook.ts';
import { DisplayDispatch } from '../store/store.ts';

export function useLoadPlanningById(planningId: string | undefined) {
    const dispatch: DisplayDispatch = useDispatch();

    useEffect(() => {
        if (planningId) {
            dispatch(displayTracksActions.removeDisplayTracks());
            dispatch(displayTracksActions.setIsLoading(true));

            loadServerFile(planningId, dispatch).then(() => {
                dispatch(displayTracksActions.setIsLoading(false));
                dispatch(setStartAndEndTime);
            });
        }
    }, [planningId]);
}
