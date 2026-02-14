import { State } from '../../store/types.ts';
import { AppDispatch } from '../../store/planningStore.ts';
import {
    getArrivalDateTime,
    getParticipantsDelay,
    getTrackCompositions,
    setParticipantsDelay,
} from '../../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../../store/calculatedTracks.reducer.ts';
import { mergeAndDelayAndAdjustTimes } from './solver.ts';
import { mapActions } from '../../store/map.reducer.ts';
import { getStartAndEndOfParsedTracks } from '../../../utils/parsedTracksUtil.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';

export async function calculateMerge(dispatch: AppDispatch, getState: () => State) {
    const gpxSegments = getParsedGpxSegments(getState());
    const trackCompositions = getTrackCompositions(getState());
    const arrivalDateTime = getArrivalDateTime(getState());

    if (!arrivalDateTime) {
        return;
    }

    setParticipantsDelay(getParticipantsDelay(getState()));

    const calculatedTracks = mergeAndDelayAndAdjustTimes(gpxSegments, trackCompositions, arrivalDateTime);

    dispatch(calculatedTracksActions.setCalculatedTracks(calculatedTracks));
    dispatch(mapActions.setShowCalculatedTracks(true));

    const payload = getStartAndEndOfParsedTracks(calculatedTracks);
    dispatch(mapActions.setStartAndEndTime(payload));
    return Promise.resolve();
}
