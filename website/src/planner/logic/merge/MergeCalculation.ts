import { State } from '../../store/types.ts';
import { AppDispatch } from '../../store/planningStore.ts';
import { getGpxSegments, getSegmentSpeeds } from '../../store/gpxSegments.reducer.ts';
import {
    getArrivalDateTime,
    getAverageSpeedInKmH,
    getParticipantsDelay,
    getTrackCompositions,
    PARTICIPANTS_DELAY_IN_SECONDS,
    setParticipantsDelay,
} from '../../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../../store/calculatedTracks.reducer.ts';
import { mergeAndDelayAndAdjustTimes } from './solver.ts';
import { mapActions } from '../../store/map.reducer.ts';
import { enrichGpxSegmentsWithTimeStamps } from './helper/enrichGpxSegmentsWithTimeStamps.ts';
import date from 'date-and-time';
import { clearReadableTracks, getReadableTracks, setReadableTracks } from '../../cache/readableTracks.ts';
import { clearGpxCache } from '../../../common/cache/gpxCache.ts';
import { initializeResolvedPositions } from '../resolving/streets/initializeResolvedPositions.ts';

export function calculateAndStoreStartAndEndOfSimulation(dispatch: AppDispatch, state: State) {
    const trackParticipants = getTrackCompositions(state).map((track) => track.peopleCount ?? 0);
    const maxDelay = Math.min(...trackParticipants);

    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    getReadableTracks()?.forEach((track) => {
        if (track.gpx.getStart() < startDate) {
            startDate = track.gpx.getStart();
        }

        if (track.gpx.getEnd() > endDate) {
            endDate = track.gpx.getEnd();
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
    const segmentSpeeds = getSegmentSpeeds(getState());

    if (!arrivalDateTime) {
        return;
    }

    // Clear caching of parsed gpx tracks for the calculated tracks
    clearReadableTracks();
    clearGpxCache();

    setParticipantsDelay(getParticipantsDelay(getState()));

    const gpxSegmentsWithTimeStamp = enrichGpxSegmentsWithTimeStamps(gpxSegments, averageSpeed, segmentSpeeds);

    const calculatedTracks = mergeAndDelayAndAdjustTimes(gpxSegmentsWithTimeStamp, trackCompositions, arrivalDateTime);

    // TODO: 161 This part, creating a string out of it again takes, quite some time...
    // If we manage to bring this into another process or debounce it, we could easily use the logic and have an update within a second
    const speedUp = false;
    if (!speedUp) {
        dispatch(
            calculatedTracksActions.setCalculatedTracks(
                calculatedTracks.map((track) => ({ ...track, content: track.content.toString() }))
            )
        );
        dispatch(mapActions.setShowCalculatedTracks(true));
    }

    setReadableTracks(calculatedTracks.map((track) => ({ id: track.id, gpx: track.content })));
    initializeResolvedPositions(dispatch);

    calculateAndStoreStartAndEndOfSimulation(dispatch, getState());
    return Promise.resolve();
}
