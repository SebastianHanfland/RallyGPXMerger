import { describe, expect, it } from 'vitest';
import { createPlanningStore } from '../planningStore.ts';
import {
    getDistrictLookup,
    getParsedGpxSegments,
    getPostCodeLookup,
    getStreetLookup,
    segmentDataActions,
} from '../segmentData.redux.ts';

describe('segmentData reducer', () => {
    it('preserves lookup rows referenced by manual point indexes when clearing resolved data', () => {
        const store = createPlanningStore();
        store.dispatch(
            segmentDataActions.addGpxSegments([
                { id: 'segment', filename: 'segment', points: [{ b: 1, l: 1, e: 0, t: 0, s: 1, m: 10 }] },
            ])
        );
        store.dispatch(segmentDataActions.addStreetLookup({ 1: 'API Street', 10: 'Manual Street' }));
        store.dispatch(segmentDataActions.addPostCodeLookup({ 1: '11111', 10: '22222' }));
        store.dispatch(segmentDataActions.addDistrictLookup({ 1: 'API District', 10: 'Manual District' }));

        store.dispatch(segmentDataActions.clearResolvedStreetData());

        expect(getStreetLookup(store.getState())).toEqual({ 10: 'Manual Street' });
        expect(getPostCodeLookup(store.getState())).toEqual({ 10: '22222' });
        expect(getDistrictLookup(store.getState())).toEqual({ 10: 'Manual District' });
    });

    it('creates a new manual lookup row and assigns its index to matching points', () => {
        const store = createPlanningStore();
        store.dispatch(
            segmentDataActions.addGpxSegments([
                {
                    id: 'segment',
                    filename: 'segment',
                    points: [
                        { b: 1, l: 1, e: 0, t: 0, s: 7 },
                        { b: 2, l: 2, e: 0, t: 1, s: 7 },
                        { b: 3, l: 3, e: 0, t: 2, s: 8 },
                    ],
                },
            ])
        );
        store.dispatch(segmentDataActions.addStreetLookup({ 7: 'API Street' }));
        store.dispatch(segmentDataActions.addPostCodeLookup({ 7: '12345' }));
        store.dispatch(segmentDataActions.addDistrictLookup({ 7: 'Old District' }));

        store.dispatch(
            segmentDataActions.applyManualLookup({ sourceIndex: 7, field: 'street', value: 'Manual Street' })
        );

        const segment = getParsedGpxSegments(store.getState())[0]!;
        expect(segment.points.map(({ s, m }) => (m === undefined ? { s } : { s, m }))).toEqual([
            { s: 7, m: 9 },
            { s: 7, m: 9 },
            { s: 8 },
        ]);
        expect(getStreetLookup(store.getState())[9]).toBe('Manual Street');
        expect(getPostCodeLookup(store.getState())[9]).toBe('12345');
        expect(getDistrictLookup(store.getState())[9]).toBe('Old District');
    });
});
