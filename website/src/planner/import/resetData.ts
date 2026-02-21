import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { mapActions } from '../store/map.reducer.ts';
import { geoCodingActions } from '../store/geoCoding.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { pointsActions } from '../store/points.reducer.ts';
import { backendActions } from '../store/backend.reducer.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { nodesActions } from '../store/nodes.reducer.ts';
import { settingsActions } from '../store/settings.reducer.ts';

export function resetData(dispatch: Dispatch) {
    dispatch(trackMergeActions.clear());
    dispatch(mapActions.setShowGpxSegments(true));
    dispatch(mapActions.setShowBlockStreets(false));
    dispatch(mapActions.setShowCalculatedTracks(false));
    dispatch(geoCodingActions.clear());
    dispatch(pointsActions.clear());
    dispatch(nodesActions.clear());
    dispatch(settingsActions.clear());
    dispatch(backendActions.clear());
    dispatch(segmentDataActions.clear());
    localStorage.clear();
}
