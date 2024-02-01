import { State } from '../store/types.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';

function createTooltip(counter: number, tracks: string[], planningHasTracks: boolean) {
    if (!planningHasTracks) {
        return '';
    }
    return counter === 0
        ? 'This segment is not used'
        : `This segment is used in ${counter} tracks:\n${tracks.join('\n')}`;
}

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
    const tooltip = createTooltip(counter, tracks, trackCompositions.length > 0);
    const alert = counter === 0 && trackCompositions.length > 0;
    return { alert, tooltip };
};
