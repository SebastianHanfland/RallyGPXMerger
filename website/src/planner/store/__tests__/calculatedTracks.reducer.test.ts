import { createPlanningStore } from '../planningStore.ts';
import { calculatedTracksActions, getCalculatedTracks } from '../calculatedTracks.reducer.ts';

describe('Calculated Track reducer test', () => {
    it('should set and remove calculated tracks', () => {
        // given
        const store = createPlanningStore();
        expect(getCalculatedTracks(store.getState())).toEqual([]);
        const dummyTrack = { content: 'a trkpt', id: '1', filename: 'b' };

        // when
        store.dispatch(calculatedTracksActions.setCalculatedTracks([dummyTrack]));

        // then
        expect(getCalculatedTracks(store.getState())).toEqual([dummyTrack]);
        store.dispatch(calculatedTracksActions.removeCalculatedTracks());
        expect(getCalculatedTracks(store.getState())).toEqual([]);
    });
});
