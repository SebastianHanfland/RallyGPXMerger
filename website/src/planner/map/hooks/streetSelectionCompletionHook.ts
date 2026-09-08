import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { getStreetPointSelection, mapActions } from '../../store/map.reducer.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getRoutePointReferences } from '../../logic/resolving/streets/streetRangeEditing.ts';
import { applyStreetSelection } from '../../streets/streetEditing.ts';

export function streetSelectionCompletionHook() {
    const selection = useSelector(getStreetPointSelection);
    const track = useSelector(getTrackCompositions).find(({ id }) => id === selection?.trackId);
    const segments = useSelector(getParsedGpxSegments);
    const dispatch = useDispatch();
    const routePoints = useMemo(() => (track ? getRoutePointReferences(track, segments) : []), [track, segments]);

    useEffect(() => {
        if (!selection?.selectedPoint || !track) return;
        const selectedRouteIndex = routePoints.findIndex(
            ({ segmentId, pointIndex }) =>
                segmentId === selection.selectedPoint?.segmentId && pointIndex === selection.selectedPoint?.pointIndex
        );
        if (selectedRouteIndex < 0) return;
        applyStreetSelection(dispatch, selection, routePoints, selectedRouteIndex);
    }, [dispatch, routePoints, selection, track]);

    useEffect(
        () => () => {
            dispatch(mapActions.setHighlightedStreetPath(undefined));
            dispatch(mapActions.setStreetPointSelection(undefined));
        },
        [dispatch]
    );
}
