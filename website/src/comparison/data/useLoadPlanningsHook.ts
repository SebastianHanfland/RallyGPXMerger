import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { comparisonActions, getComparisonTrackTitles } from '../store/tracks.reducer.ts';
import { loadServerFile } from './loadServerFile.ts';
import { useGetUrlParam } from '../../utils/linkUtil.ts';
import { mapActions } from '../store/map.reducer.ts';

export function useLoadPlanningsHook(planningIds: string[]) {
    const dispatch = useDispatch();
    const trackTitles = useSelector(getComparisonTrackTitles);
    const hasColorsDefined = !!useGetUrlParam('colors=');

    useEffect(() => {
        dispatch(comparisonActions.setPlanningIds(planningIds));
        if (hasColorsDefined) {
            dispatch(mapActions.setUseVersionColor(true));
        }
        if ([...new Set(planningIds)].length !== planningIds.length) {
            alert('Duplicated ids in URL');
        }

        Promise.all([planningIds.map((planningId) => loadServerFile(planningId, dispatch))]);
    }, []);

    useEffect(() => {
        if (Object.keys(trackTitles).length !== [...new Set(planningIds)].length) {
            dispatch(comparisonActions.setIsLoading(true));
        } else {
            dispatch(comparisonActions.setIsLoading(false));
        }
    }, [Object.keys(trackTitles).length]);

    useEffect(() => {
        document.title = `Vergleich: ${Object.values(trackTitles).join(', ')}`;
    }, [trackTitles]);
}
