import { State } from '../../store/types.ts';
import { AppDispatch } from '../../store/store.ts';
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
import { SimpleGPX } from '../../../utils/SimpleGPX.ts';
import { initializeResolvedPositions } from '../resolving/streets/initializeResolvedPositions.ts';
import date from 'date-and-time';
import { clearReadableTracks, getReadableTracks, setReadableTracks } from '../../cache/readableTracks.ts';
import { clearGpxCache } from '../../../common/map/gpxCache.ts';

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

    dispatch(calculatedTracksActions.setCalculatedTracks(calculatedTracks));
    dispatch(mapActions.setShowCalculatedTracks(true));

    const readableTracks = getReadableTracks();
    if (!readableTracks) {
        setReadableTracks(
            calculatedTracks.map((track) => ({ id: track.id, gpx: SimpleGPX.fromString(track.content) }))
        );
        initializeResolvedPositions(dispatch);
    }
    calculateAndStoreStartAndEndOfSimulation(dispatch, getState());
    return Promise.resolve();
}
