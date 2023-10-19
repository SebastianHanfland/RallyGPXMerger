import { State } from '../store/types.ts';
import { AppDispatch } from '../store/store.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { getArrivalDateTime, getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { mergeTracks } from './primitive/primitiveSolver.ts';
import { GpxMergeLogic } from './types.ts';

const dummy: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    console.log(gpxSegments, arrivalDateTime);
    return trackCompositions.map((track) => ({
        id: track.id,
        filename: `${track.name}.gpx`,
        content: '1234',
    }));
};

const solveFunction: GpxMergeLogic[] = [dummy, mergeTracks];

export function calculateMerge(dispatch: AppDispatch, getState: () => State) {
    const gpxSegments = getGpxSegments(getState());
    const trackCompositions = getTrackCompositions(getState());
    const arrivalDateTime = getArrivalDateTime(getState());

    if (!arrivalDateTime) {
        return;
    }

    const calculatedTracks = solveFunction[1](gpxSegments, trackCompositions, arrivalDateTime);

    dispatch(calculatedTracksActions.setCalculatedTracks(calculatedTracks));
}
