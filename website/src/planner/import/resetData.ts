import { trackMergeActions } from '../store/trackMerge.reducer';
import { mapActions } from '../store/map.reducer';
import { geoCodingActions } from '../store/geoCoding.reducer';
import { Dispatch } from '@reduxjs/toolkit';
import { pointsActions } from '../store/points.reducer';
import { backendActions } from '../store/backend.reducer';
import { segmentDataActions } from '../store/segmentData.redux';
import { nodesActions } from '../store/nodes.reducer';
import { settingsActions } from '../store/settings.reducer';

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
