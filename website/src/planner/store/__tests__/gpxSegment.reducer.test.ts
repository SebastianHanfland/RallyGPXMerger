import { createStore } from '../planningStore.ts';
import { getGpxSegments, gpxSegmentsActions } from '../gpxSegments.reducer.ts';

import { GpxSegment } from '../../../common/types.ts';

describe('Gpx segment reducer test', () => {
    const dummyGpxSegment1: GpxSegment = { content: 'a trkpt', id: '1', filename: 'b' };
    const dummyGpxSegment2: GpxSegment = { content: 'b trkpt', id: '2', filename: 'c' };

    it('should set and remove gpx segments', () => {
        // given
        const store = createStore();
        expect(getGpxSegments(store.getState())).toEqual([]);

        // when & then
        store.dispatch(gpxSegmentsActions.addGpxSegments([dummyGpxSegment1, dummyGpxSegment2]));
        expect(getGpxSegments(store.getState())).toEqual([dummyGpxSegment1, dummyGpxSegment2]);

        // when & then
        store.dispatch(gpxSegmentsActions.removeGpxSegment(dummyGpxSegment1.id));
        expect(getGpxSegments(store.getState())).toEqual([dummyGpxSegment2]);

        // when & then
        store.dispatch(gpxSegmentsActions.clearGpxSegments());
        expect(getGpxSegments(store.getState())).toEqual([]);
    });

    it('should change file content', () => {
        // given
        const store = createStore();
        store.dispatch(gpxSegmentsActions.addGpxSegments([dummyGpxSegment1, dummyGpxSegment2]));

        // when
        store.dispatch(gpxSegmentsActions.changeGpxSegmentContent({ id: '2', newContent: 'newC trkpt' }));

        // then
        expect(getGpxSegments(store.getState())).toEqual([
            dummyGpxSegment1,
            { ...dummyGpxSegment2, content: 'newC trkpt' },
        ]);
    });
});
