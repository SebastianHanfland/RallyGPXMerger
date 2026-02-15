import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { mapActions } from '../store/map.reducer.ts';
import { geoCodingActions } from '../store/geoCoding.reducer.ts';
import { layoutActions } from '../store/layout.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { pointsActions } from '../store/points.reducer.ts';
import { backendActions } from '../store/backend.reducer.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';

export function resetData(dispatch: Dispatch) {
    dispatch(trackMergeActions.clear());
    dispatch(mapActions.setShowGpxSegments(true));
    dispatch(mapActions.setShowBlockStreets(false));
    dispatch(mapActions.setShowCalculatedTracks(false));
    dispatch(geoCodingActions.clear());
    dispatch(layoutActions.selectSection('menu'));
    dispatch(pointsActions.clear());
    dispatch(backendActions.clear());
    dispatch(segmentDataActions.clear());
    localStorage.clear();
}
