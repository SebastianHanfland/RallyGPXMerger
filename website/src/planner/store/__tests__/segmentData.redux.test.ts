import { describe, expect, it } from 'vitest';
import { createPlanningStore } from '../planningStore.ts';
import {
    getDistrictLookup,
    getPostCodeLookup,
    getReplaceStreetLookup,
    getStreetLookup,
    segmentDataActions,
} from '../segmentData.redux.ts';

describe('segmentData reducer', () => {
    it('clears resolved street data without clearing manual replacements', () => {
        const store = createPlanningStore();
        store.dispatch(segmentDataActions.addStreetLookup({ 1: 'Main Street' }));
        store.dispatch(segmentDataActions.addPostCodeLookup({ 1: '12345' }));
        store.dispatch(segmentDataActions.addDistrictLookup({ 1: 'Augsburg' }));
        store.dispatch(segmentDataActions.addReplaceStreetLookup({ 1: 'Manual Street' }));

        store.dispatch(segmentDataActions.clearResolvedStreetData());

        expect(getStreetLookup(store.getState())).toEqual({});
        expect(getPostCodeLookup(store.getState())).toEqual({});
        expect(getDistrictLookup(store.getState())).toEqual({});
        expect(getReplaceStreetLookup(store.getState())).toEqual({ 1: 'Manual Street' });
    });
});
