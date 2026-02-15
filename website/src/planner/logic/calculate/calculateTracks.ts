import { State } from '../../store/types.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';

export const getCalculatedTracks = (state: State) => {
    const trackCompositions = getTrackCompositions(state);
    const segments = getParsedGpxSegments(state);
    return trackCompositions.map((track) => {
        track.segmentIds;
    });
};
