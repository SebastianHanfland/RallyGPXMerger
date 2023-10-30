import { State } from '../store/types.ts';
import { AppDispatch } from '../store/store.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import {
    getArrivalDateTime,
    getAverageSpeedInKmH,
    getParticipantsDelay,
    getTrackCompositions,
    setParticipantsDelay,
} from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';
import { mergeAndDelayAndAdjustTimes } from './solver.ts';
import { clearReadableTracks } from '../components/map/hooks/trackSimulationReader.ts';
import { calculateParticipants } from './helper/calculateParticipants.ts';
import { mapActions } from '../store/map.reducer.ts';
import { enrichGpxSegmentsWithTimeStamps } from './helper/enrichGpxSegmentsWithTimeStamps.ts';

export async function calculateMerge(dispatch: AppDispatch, getState: () => State) {
    const gpxSegments = getGpxSegments(getState());
    const trackCompositions = getTrackCompositions(getState());
    const arrivalDateTime = getArrivalDateTime(getState());
    const averageSpeed = getAverageSpeedInKmH(getState());

    if (!arrivalDateTime) {
        return;
    }

    // Clear caching of parsed gpx tracks for the calculated tracks
    clearReadableTracks();

    setParticipantsDelay(getParticipantsDelay(getState()));

    const gpxSegmentsWithTimeStamp = enrichGpxSegmentsWithTimeStamps(gpxSegments, averageSpeed);

    const calculatedTracks = mergeAndDelayAndAdjustTimes(gpxSegmentsWithTimeStamp, trackCompositions, arrivalDateTime);
    const participants = calculateParticipants(gpxSegmentsWithTimeStamp, trackCompositions);

    dispatch(calculatedTracksActions.setCalculatedTracks(calculatedTracks));
    dispatch(calculatedTracksActions.setParticipants(participants));
    dispatch(mapActions.setSource('tracks'));
    return Promise.resolve();
}
