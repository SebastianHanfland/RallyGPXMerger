import { State } from '../../store/types.ts';
import { AppDispatch } from '../../store/planningStore.ts';
import { getGpxSegments, getSegmentSpeeds } from '../../store/gpxSegments.reducer.ts';
import {
    getArrivalDateTime,
    getAverageSpeedInKmH,
    getParticipantsDelay,
    getTrackCompositions,
    setParticipantsDelay,
} from '../../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../../store/calculatedTracks.reducer.ts';
import { mergeAndDelayAndAdjustTimes } from './solver.ts';
import { mapActions } from '../../store/map.reducer.ts';
import { enrichGpxSegmentsWithTimeStamps } from './helper/enrichGpxSegmentsWithTimeStamps.ts';
import { initializeResolvedPositions } from '../resolving/streets/initializeResolvedPositions.ts';
import { parsedTracksActions } from '../../store/parsedTracks.reducer.ts';
import { ParsedTrack } from '../../../common/types.ts';
import { getColorFromUuid } from '../../../utils/colorUtil.ts';
import { SimpleGPX } from '../../../utils/SimpleGPX.ts';
import { optionallyDecompress } from '../../store/compressHelper.ts';
import { getStartAndEndOfParsedTracks } from '../../../utils/parsedTracksUtil.ts';

export async function calculateMerge(dispatch: AppDispatch, getState: () => State) {
    const gpxSegments = getGpxSegments(getState());
    const trackCompositions = getTrackCompositions(getState());
    const arrivalDateTime = getArrivalDateTime(getState());
    const averageSpeed = getAverageSpeedInKmH(getState());
    const segmentSpeeds = getSegmentSpeeds(getState());

    if (!arrivalDateTime) {
        return;
    }

    setParticipantsDelay(getParticipantsDelay(getState()));

    const gpxSegmentsWithTimeStamp = enrichGpxSegmentsWithTimeStamps(gpxSegments, averageSpeed, segmentSpeeds);
    const calculatedTracks = mergeAndDelayAndAdjustTimes(gpxSegmentsWithTimeStamp, trackCompositions, arrivalDateTime);

    dispatch(calculatedTracksActions.setCalculatedTracks(calculatedTracks));
    dispatch(mapActions.setShowCalculatedTracks(true));

    const parsedTracks = calculatedTracks.map(
        (track): ParsedTrack => ({
            id: track.id,
            filename: track.filename,
            peopleCount: track.peopleCount,
            version: 'current',
            color: getColorFromUuid(track.id),
            points: SimpleGPX.fromString(optionallyDecompress(track.content)).getPoints(),
        })
    );

    dispatch(parsedTracksActions.setParsedTracks(parsedTracks));
    initializeResolvedPositions(parsedTracks)(dispatch);

    const payload = getStartAndEndOfParsedTracks(parsedTracks);
    dispatch(mapActions.setStartAndEndTime(payload));
    return Promise.resolve();
}
