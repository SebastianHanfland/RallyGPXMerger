import { State } from '../store/types.ts';
import { layoutActions } from '../store/layout.reducer.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { v4 as uuidv4 } from 'uuid';
import { calculateMerge } from '../logic/merge/MergeCalculation.ts';
import { AppDispatch } from '../store/store.ts';

export const simpleRallyThunk = (dispatch: AppDispatch, getState: () => State) => {
    const gpxSegments = getGpxSegments(getState());
    gpxSegments.forEach((segment) => {
        trackMergeActions.addTrackComposition({ id: uuidv4(), segmentIds: [segment.id], name: segment.filename });
    });
    dispatch(calculateMerge);
    // Maybe even the street resolving
    // Offer document for download
    dispatch(layoutActions.selectSection('gps'));
};
