import { afterEach, describe, expect, it, vi } from 'vitest';
import { createPlanningStore } from '../../../../store/planningStore.ts';
import {
    getDistrictLookup,
    getPostCodeLookup,
    getStreetLookup,
    segmentDataActions,
} from '../../../../store/segmentData.redux.ts';
import { enrichStreetWithPostCodeAndDistrict } from '../enrichWithPostCodeAndDistrict.ts';

describe('enrichStreetWithPostCodeAndDistrict', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('resolves a new street using points from multiple segments without changing its street name', async () => {
        vi.stubGlobal(
            'fetch',
            vi.fn().mockResolvedValue({
                json: () =>
                    Promise.resolve({
                        postcode: 12345,
                        city: 'Example district',
                        localityInfo: { administrative: [], informative: [] },
                    }),
            })
        );
        const store = createPlanningStore();
        store.dispatch(
            segmentDataActions.addGpxSegments([
                {
                    id: 'first',
                    filename: 'first',
                    points: [{ b: 48, l: 11, e: 0, t: 0, s: 7, m: 20 }],
                },
                {
                    id: 'second',
                    filename: 'second',
                    points: [{ b: 48.2, l: 11.2, e: 0, t: 1, s: 8, m: 20 }],
                },
            ])
        );
        store.dispatch(segmentDataActions.addStreetLookup({ 20: undefined }));

        await store.dispatch(enrichStreetWithPostCodeAndDistrict(20));

        expect(getStreetLookup(store.getState())[20]).toBeUndefined();
        expect(getPostCodeLookup(store.getState())[20]).toBe('12345');
        expect(getDistrictLookup(store.getState())[20]).toBe('Example district');
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('latitude=48.1&longitude=11.1'));
    });
});
