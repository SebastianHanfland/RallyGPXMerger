import { createStore } from '../store.ts';
import { getCurrenMapSource, getCurrenMapTime, mapActions } from '../map.reducer.ts';

describe('Map reducer test', () => {
    it('should set map source', () => {
        // given
        const store = createStore();
        expect(getCurrenMapSource(store.getState())).toEqual('segments');

        // when
        store.dispatch(mapActions.setSource('tracks'));

        // then
        expect(getCurrenMapSource(store.getState())).toEqual('tracks');
    });

    it('should set map time', () => {
        // given
        const store = createStore();
        expect(getCurrenMapTime(store.getState())).toEqual(0);

        // when
        store.dispatch(mapActions.setCurrentTime(1234));

        // then
        expect(getCurrenMapTime(store.getState())).toEqual(1234);
    });
});
