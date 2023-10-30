import { createStore } from '../store.ts';
import { calculatedTracksActions, getCalculatedTracks, getTrackParticipants } from '../calculatedTracks.reducer.ts';

describe('Calculated Track reducer test', () => {
    it('should set and remove participants', () => {
        // given
        const store = createStore();
        expect(getTrackParticipants(store.getState())).toEqual([]);

        // when
        store.dispatch(calculatedTracksActions.setParticipants([1, 2]));

        // then
        expect(getTrackParticipants(store.getState())).toEqual([1, 2]);
        store.dispatch(calculatedTracksActions.removeCalculatedTracks());
        expect(getTrackParticipants(store.getState())).toEqual([]);
    });

    it('should set and remove calculated tracks', () => {
        // given
        const store = createStore();
        expect(getCalculatedTracks(store.getState())).toEqual([]);
        const dummyTrack = { content: 'a', id: '1', filename: 'b' };

        // when
        store.dispatch(calculatedTracksActions.setCalculatedTracks([dummyTrack]));

        // then
        expect(getCalculatedTracks(store.getState())).toEqual([dummyTrack]);
        store.dispatch(calculatedTracksActions.removeCalculatedTracks());
        expect(getCalculatedTracks(store.getState())).toEqual([]);
    });
});
