import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { zipTracksActions } from '../store/tracks.reducer.ts';
import { loadServerFile } from './loadServerFile.ts';
import { setStartAndEndTime } from './loadFilesHook.ts';

export function useLoadPlanningsHook(planningIds: string[]) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(zipTracksActions.removeZipTracks());
        dispatch(zipTracksActions.setIsLoading(true));
        Promise.all([planningIds.map((planningId) => loadServerFile(planningId, dispatch))])
            .then(() => setTimeout(() => setStartAndEndTime(dispatch), 500))
            .then(() => dispatch(zipTracksActions.setIsLoading(false)));
    }, []);
}
