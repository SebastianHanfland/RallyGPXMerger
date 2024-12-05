import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { zipTracksActions } from '../store/zipTracks.reducer.ts';
import { loadServerFile } from './loadServerFile.ts';
import { setStartAndEndTime } from './loadFilesHook.ts';

export function useLoadPlanningById(planningId: string | undefined) {
    const dispatch = useDispatch();

    useEffect(() => {
        if (planningId) {
            dispatch(zipTracksActions.removeZipTracks());
            dispatch(zipTracksActions.setIsLoading(true));

            loadServerFile(planningId, dispatch).then(() => {
                dispatch(zipTracksActions.setIsLoading(false));
                setStartAndEndTime(dispatch);
            });
        }
    }, [planningId]);
}

export function useLoadPlannings(planningIds: string[]) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(zipTracksActions.removeZipTracks());
        dispatch(zipTracksActions.setIsLoading(true));
        Promise.all([planningIds.map((planningId) => loadServerFile(planningId, dispatch))])
            .then(() => {
                setTimeout(() => setStartAndEndTime(dispatch), 500);
            })
            .then(() => dispatch(zipTracksActions.setIsLoading(false)));
    }, []);
}
