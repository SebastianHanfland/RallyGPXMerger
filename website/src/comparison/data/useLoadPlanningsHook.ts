import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { comparisonActions } from '../store/tracks.reducer.ts';
import { loadServerFile } from './loadServerFile.ts';

export function useLoadPlanningsHook(planningIds: string[]) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(comparisonActions.removeComparisonTracks());
        dispatch(comparisonActions.setIsLoading(true));
        dispatch(comparisonActions.setPlanningIds(planningIds));

        Promise.all([planningIds.map((planningId) => loadServerFile(planningId, dispatch))]).then(() =>
            dispatch(comparisonActions.setIsLoading(false))
        );
    }, []);
}
