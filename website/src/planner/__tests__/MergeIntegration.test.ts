import { createStore } from '../store/store.ts';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { gpxA1Content, gpxABContent, gpxB1Content } from './gpxContents.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { calculateMerge } from '../logic/merge/MergeCalculation.ts';

describe('test merging of gpx file', () => {
    it('Should make a simple merge', () => {
        // given
        const store = createStore();
        store.dispatch(
            gpxSegmentsActions.addGpxSegments([
                { id: '1', content: gpxA1Content, filename: 'A1' },
                { id: '2', content: gpxB1Content, filename: 'B1' },
                { id: '3', content: gpxABContent, filename: 'AB' },
            ])
        );
        store.dispatch(trackMergeActions.addTrackComposition({ id: '1', segmentIds: ['1', '3'], name: 'A' }));
        store.dispatch(trackMergeActions.addTrackComposition({ id: '2', segmentIds: ['2', '3'], name: 'B' }));
        store.dispatch(trackMergeActions.setArrivalDateTime('2023-10-17T22:15:00.000Z'));

        store.dispatch(calculateMerge);

        const calculatedTracks = getCalculatedTracks(store.getState());
        expect(calculatedTracks).toHaveLength(2);
    });
});
