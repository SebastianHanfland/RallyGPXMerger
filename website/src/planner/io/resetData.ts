import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { mapActions } from '../store/map.reducer.ts';
import { geoCodingActions } from '../store/geoCoding.reducer.ts';
import { layoutActions } from '../store/layout.reducer.ts';
import { geoCodingRequestsActions } from '../store/geoCodingRequests.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { pointsActions } from '../store/points.reducer.ts';
import { clearGpxCache } from '../../common/cache/gpxCache.ts';
import { backendActions } from '../store/backend.reducer.ts';
import { parsedTracksActions } from '../store/parsedTracks.reducer.ts';

export function resetData(dispatch: Dispatch) {
    dispatch(parsedTracksActions.clear());
    dispatch(gpxSegmentsActions.clearGpxSegments());
    dispatch(trackMergeActions.clear());
    dispatch(calculatedTracksActions.removeCalculatedTracks());
    dispatch(mapActions.setShowGpxSegments(true));
    dispatch(mapActions.setShowBlockStreets(false));
    dispatch(mapActions.setShowCalculatedTracks(false));
    dispatch(geoCodingActions.clear());
    dispatch(layoutActions.selectSection('menu'));
    dispatch(geoCodingRequestsActions.clear());
    dispatch(pointsActions.clear());
    dispatch(backendActions.clear());
    clearGpxCache();
    localStorage.clear();
}
