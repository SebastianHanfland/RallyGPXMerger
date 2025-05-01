import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { comparisonActions, getComparisonTrackTitles } from '../store/tracks.reducer.ts';
import { loadServerFile } from './loadServerFile.ts';

export function useLoadPlanningsHook(planningIds: string[]) {
    const dispatch = useDispatch();
    const trackTitles = useSelector(getComparisonTrackTitles);

    useEffect(() => {
        dispatch(comparisonActions.removeComparisonTracks());
        dispatch(comparisonActions.setIsLoading(true));
        dispatch(comparisonActions.setPlanningIds(planningIds));

        Promise.all([planningIds.map((planningId) => loadServerFile(planningId, dispatch))]).then(() =>
            dispatch(comparisonActions.setIsLoading(false))
        );
    }, []);

    useEffect(() => {
        document.title = `Vergleich: ${Object.values(trackTitles).join(', ')}`;
    }, [trackTitles]);
}
