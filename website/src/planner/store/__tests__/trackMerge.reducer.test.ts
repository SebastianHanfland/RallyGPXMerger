import { createPlanningStore } from '../planningStore.ts';
import { getTrackCompositions, trackMergeActions } from '../trackMerge.reducer.ts';
import { SEGMENT } from '../types.ts';

vi.mock('uuid', () => ({
    v4: () => '1',
}));

function getSegment(id: string) {
    return { id, segmentId: id, type: SEGMENT };
}

describe('TrackMerge reducer', () => {
    it('should create an empty composition and fill it', () => {
        // given
        const trackName = 'ABC';
        const store = createPlanningStore();
        expect(getTrackCompositions(store.getState())).toEqual([]);

        // when & then
        store.dispatch(trackMergeActions.addTrackComposition());
        expect(getTrackCompositions(store.getState())).toEqual([{ id: '1', segments: [], name: '' }]);

        // when & then
        store.dispatch(trackMergeActions.setTrackName({ id: '1', trackName }));
        expect(getTrackCompositions(store.getState())).toEqual([{ id: '1', name: trackName, segments: [] }]);

        // when & then
        store.dispatch(trackMergeActions.setSegments({ id: '1', segments: [getSegment('3'), getSegment('4')] }));
        expect(getTrackCompositions(store.getState())).toEqual([
            { id: '1', name: trackName, segments: ['3', '4'].map(getSegment) },
        ]);

        // when & then
        store.dispatch(trackMergeActions.removeGpxSegment('3'));
        expect(getTrackCompositions(store.getState())).toEqual([
            { id: '1', name: trackName, segments: [getSegment('4')] },
        ]);

        // when & then
        store.dispatch(trackMergeActions.removeTrackComposition('1'));
        expect(getTrackCompositions(store.getState())).toEqual([]);
    });

    it('should initialize full track', () => {
        // given
        const track = { id: '1', name: 'abc', segments: [getSegment('2')] };
        const store = createPlanningStore();
        expect(getTrackCompositions(store.getState())).toEqual([]);

        // when
        store.dispatch(trackMergeActions.addTrackComposition(track));

        // then
        expect(getTrackCompositions(store.getState())).toEqual([track]);
    });
});
