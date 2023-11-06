import { State } from '../store/types.ts';
import { AppDispatch } from '../store/store.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import {
    getArrivalDateTime,
    getAverageSpeedInKmH,
    getParticipantsDelay,
    getTrackCompositions,
    PARTICIPANTS_DELAY_IN_SECONDS,
    setParticipantsDelay,
} from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions, getTrackParticipants } from '../store/calculatedTracks.reducer.ts';
import { mergeAndDelayAndAdjustTimes } from './solver.ts';
import { calculateParticipants } from './helper/calculateParticipants.ts';
import { mapActions } from '../store/map.reducer.ts';
import { enrichGpxSegmentsWithTimeStamps } from './helper/enrichGpxSegmentsWithTimeStamps.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { initializeResolvedPositions } from '../reverseGeoCoding/initializeResolvedPositions.ts';
import date from 'date-and-time';

let readableTracks: SimpleGPX[] | undefined = undefined;

export const clearReadableTracks = () => {
    readableTracks = undefined;
};

export const getReadableTracks = () => readableTracks;

function calculateAndStoreStartAndEndOfSimulation(dispatch: AppDispatch, state: State) {
    const trackParticipants = getTrackParticipants(state);
    const maxDelay = Math.min(...trackParticipants);

    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    readableTracks?.forEach((track) => {
        if (track.getStart() < startDate) {
            startDate = track.getStart();
        }

        if (track.getEnd() > endDate) {
            endDate = track.getEnd();
        }
    });

    const payload = {
        start: startDate,
        end: date.addSeconds(new Date(endDate), maxDelay * PARTICIPANTS_DELAY_IN_SECONDS).toISOString(),
    };
    dispatch(mapActions.setStartAndEndTime(payload));
}

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

    if (!readableTracks) {
        readableTracks = calculatedTracks.map((track) => SimpleGPX.fromString(track.content));
        initializeResolvedPositions(dispatch);
    }
    calculateAndStoreStartAndEndOfSimulation(dispatch, getState());
    return Promise.resolve();
}
