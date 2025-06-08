import { Dispatch } from '@reduxjs/toolkit';
import { GpxSegment } from '../../common/types.ts';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';

export const addGpxSegments = (gpxSegments: GpxSegment[]) => (dispatch: Dispatch) => {
    dispatch(gpxSegmentsActions.addGpxSegments(gpxSegments));
};
