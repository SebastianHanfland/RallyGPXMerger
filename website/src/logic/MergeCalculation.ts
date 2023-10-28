import { State } from '../store/types.ts';
import { AppDispatch } from '../store/store.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import {
    getArrivalDateTime,
    getParticipantsDelay,
    getTrackCompositions,
    setParticipantsDelay,
} from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { mergeAndAdjustTimes } from './primitive/primitiveSolver.ts';
import { GpxMergeLogic } from './types.ts';
import { mergeAndDelayAndAdjustTimes } from './withPeoples/withPeoplesSolver.ts';
import { clearReadableTracks } from '../components/map/trackSimulationReader.ts';
import { calculateParticipants } from './helper/calculateParticipants.ts';

const solveFunctions: GpxMergeLogic[] = [mergeAndAdjustTimes, mergeAndDelayAndAdjustTimes];

export function calculateMerge(dispatch: AppDispatch, getState: () => State) {
    const gpxSegments = getGpxSegments(getState());
    const trackCompositions = getTrackCompositions(getState());
    const arrivalDateTime = getArrivalDateTime(getState());

    if (!arrivalDateTime) {
        return;
    }

    // Clear caching of parsed gpx tracks for the calculated tracks
    clearReadableTracks();

    setParticipantsDelay(getParticipantsDelay(getState()));
    const calculatedTracks = solveFunctions[1](gpxSegments, trackCompositions, arrivalDateTime);
    const participants = calculateParticipants(gpxSegments, trackCompositions);

    dispatch(calculatedTracksActions.setCalculatedTracks(calculatedTracks));
    dispatch(calculatedTracksActions.setParticipants(participants));
}
