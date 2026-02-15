import { State } from '../../store/types.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { updateExtraDelayOnTracks } from './solver.ts';
import { assembleTrackFromSegments } from './helper/assembleTrackFromSegments.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';

export const calculateTracks = (state: State) => {
    const trackCompositions = getTrackCompositions(state);
    const segments = getParsedGpxSegments(state);
    const trackWithEndDelay = updateExtraDelayOnTracks(trackCompositions);

    return trackWithEndDelay.map((track) => assembleTrackFromSegments(track, segments));
};
