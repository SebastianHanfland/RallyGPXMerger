import { State } from '../store/types.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { IntlShape } from 'react-intl';

function createTooltip(intl: IntlShape, counter: number, tracks: string[], planningHasTracks: boolean) {
    if (!planningHasTracks) {
        return '';
    }
    return counter === 0
        ? intl.formatMessage({ id: 'msg.segmentNotUsed.hint' })
        : intl.formatMessage({ id: 'msg.segmentUsed.hint' }, { counter, tracks: tracks.join('\n') });
}

export const countUsagesOfSegment = (segmentId: string, intl: IntlShape) => (state: State) => {
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
    const tooltip = createTooltip(intl, counter, tracks, trackCompositions.length > 0);
    const alert = counter === 0 && trackCompositions.length > 0;
    return { alert, tooltip };
};
