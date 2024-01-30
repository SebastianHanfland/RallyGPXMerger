import { State } from '../store/types.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';

export const countUsagesOfSegment = (segmentId: string) => (state: State) => {
    const trackCompositions = getTrackCompositions(state);
    let counter = 0;
    const tracks: string[] = [];
    trackCompositions.forEach((track) => {
        if (track.segmentIds.includes(segmentId)) {
            counter++;
            if (track.name) {
                tracks.push(track.name);
            }
        }
    });
    return { counter, tracks };
};
