import { createPlanningStore } from '../../../../store/planningStore.ts';
import { enrichGpxSegmentsWithStreetNames } from '../mapMatchingStreetResolver.ts';
import { dummySegment } from './dummySegment.ts';
import { geoApifyResponse } from './dummyResponse.ts';
import { getParsedGpxSegments, getStreetLookup } from '../../../../store/segmentData.redux.ts';
import { Mock } from 'vitest';

// @ts-ignore
global.fetch = vi.fn();

describe('mapMatchingStreetResolver', () => {
    it('enrichOneGpxSegment', async () => {
        // when
        const planningStore = createPlanningStore();
        (fetch as Mock).mockResolvedValue({ json: () => new Promise((resolve) => resolve(geoApifyResponse)) });

        await planningStore.dispatch(enrichGpxSegmentsWithStreetNames([dummySegment]));

        // then
        const streetLookup = getStreetLookup(planningStore.getState());
        expect(Object.keys(streetLookup).length).toEqual(10);
        const segments = getParsedGpxSegments(planningStore.getState());
        segments;
    });
});
