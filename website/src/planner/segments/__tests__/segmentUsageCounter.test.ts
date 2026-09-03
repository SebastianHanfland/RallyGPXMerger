import { describe, expect, it } from 'vitest';
import { createPlanningStore } from '../../store/planningStore.ts';
import { getSegmentUsages } from '../segmentUsageCounter.ts';
import { SEGMENT } from '../../store/types.ts';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';

function segment(id: string) {
    return { id, segmentId: id, type: SEGMENT } as const;
}

describe('getSegmentUsages', () => {
    it('counts each track once and records named tracks', () => {
        const store = createPlanningStore();

        store.dispatch(
            trackMergeActions.setTracks([
                { id: 'track-1', name: 'Morning', segments: [segment('a'), segment('a'), segment('b')] },
                { id: 'track-2', name: 'Evening', segments: [segment('a')] },
                { id: 'track-3', segments: [segment('a')] },
            ])
        );

        expect(getSegmentUsages(store.getState())).toEqual({
            a: { counter: 3, tracks: ['Morning', 'Evening'] },
            b: { counter: 1, tracks: ['Morning'] },
        });
        expect(getSegmentUsages(store.getState()).missing).toBeUndefined();
    });

    it('returns the same lookup when track compositions are unchanged', () => {
        const store = createPlanningStore();

        const first = getSegmentUsages(store.getState());
        const second = getSegmentUsages(store.getState());

        expect(second).toBe(first);
    });

    it('recalculates when track compositions change', () => {
        const store = createPlanningStore();
        const first = getSegmentUsages(store.getState());

        store.dispatch(trackMergeActions.setTracks([{ id: 'track-1', segments: [segment('a')] }]));

        const second = getSegmentUsages(store.getState());
        expect(second).not.toBe(first);
        expect(second).toEqual({ a: { counter: 1, tracks: [] } });
    });
});
