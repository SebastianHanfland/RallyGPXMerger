import { describe, expect, it } from 'vitest';
import { createPlanningStore } from '../planningStore.ts';
import { getNodeStreetNames, nodesActions } from '../nodes.reducer.ts';

describe('nodes reducer street names', () => {
    it('stores and clears a shared node street name', () => {
        const store = createPlanningStore();

        store.dispatch(nodesActions.setNodeStreetName({ segmentAfter: 'after', streetName: 'Node Name' }));
        expect(getNodeStreetNames(store.getState())).toEqual({ after: 'Node Name' });

        store.dispatch(nodesActions.setNodeStreetName({ segmentAfter: 'after', streetName: undefined }));
        expect(getNodeStreetNames(store.getState())).toEqual({});
    });
});
