import { describe, expect, it } from 'vitest';
import { createPlanningStore } from '../../../store/planningStore';
import { segmentDataActions } from '../../../store/segmentData.redux';
import { getSegmentCoreData, getSegmentTableRows } from '../segmentTableData';

describe('segment table selectors', () => {
    it('does not recalculate segment metrics when only usage filters change', () => {
        const store = createPlanningStore();
        store.dispatch(segmentDataActions.addGpxSegments([{ id: 'a', filename: 'a.gpx', points: [] }]));
        getSegmentCoreData.resetRecomputations();

        const initialRows = getSegmentTableRows(store.getState());
        store.dispatch(segmentDataActions.toggleShowUsedSegments());
        const filteredRows = getSegmentTableRows(store.getState());

        expect(getSegmentCoreData.recomputations()).toBe(1);
        expect(filteredRows).not.toBe(initialRows);
    });
});
