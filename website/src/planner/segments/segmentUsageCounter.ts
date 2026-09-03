import { createSelector } from '@reduxjs/toolkit';
import { IntlShape } from 'react-intl';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';

export interface SegmentUsage {
    counter: number;
    tracks: string[];
}

export type SegmentUsages = Record<string, SegmentUsage>;

export const getSegmentUsages = createSelector([getTrackCompositions], (trackCompositions): SegmentUsages => {
    const usages: SegmentUsages = {};

    trackCompositions.forEach((track) => {
        const segmentIds = new Set(track.segments.map((segment) => segment.id));
        segmentIds.forEach((segmentId) => {
            const usage = usages[segmentId] ?? { counter: 0, tracks: [] };
            usage.counter++;
            if (track.name) {
                usage.tracks.push(track.name);
            }
            usages[segmentId] = usage;
        });
    });

    return usages;
});

function createTooltip(intl: IntlShape, counter: number, tracks: string[], planningHasTracks: boolean) {
    if (!planningHasTracks) {
        return '';
    }
    return counter === 0
        ? intl.formatMessage({ id: 'msg.segmentNotUsed.hint' })
        : intl.formatMessage({ id: 'msg.segmentUsed.hint' }, { counter, tracks: tracks.join('\n') });
}

export function getUsagesOfSegment(
    usageLookup: SegmentUsages,
    segmentId: string,
    intl: IntlShape,
    planningHasTracks: boolean
) {
    const usage = usageLookup[segmentId];
    const counter = usage?.counter ?? 0;
    const tracks = usage?.tracks ?? [];
    const tooltip = createTooltip(intl, counter, tracks, planningHasTracks);
    const alert = counter === 0 && planningHasTracks;
    return { alert, tooltip };
}
