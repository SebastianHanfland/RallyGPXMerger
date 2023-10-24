import { State } from '../store/types.ts';
import { AppDispatch } from '../store/store.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { getArrivalDateTime, getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { mergeAndAdjustTimes } from './primitive/primitiveSolver.ts';
import { GpxMergeLogic } from './types.ts';
import { mergeAndDelayAndAdjustTimes } from './withPeoples/withPeoplesSolver.ts';

const solveFunctions: GpxMergeLogic[] = [mergeAndAdjustTimes, mergeAndDelayAndAdjustTimes];

export function calculateMerge(dispatch: AppDispatch, getState: () => State) {
    const gpxSegments = getGpxSegments(getState());
    const trackCompositions = getTrackCompositions(getState());
    const arrivalDateTime = getArrivalDateTime(getState());

    if (!arrivalDateTime) {
        return;
    }

    const calculatedTracks = solveFunctions[1](gpxSegments, trackCompositions, arrivalDateTime);

    dispatch(calculatedTracksActions.setCalculatedTracks(calculatedTracks));
}
