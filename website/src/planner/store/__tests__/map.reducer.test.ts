import { createStore } from '../planningStore.ts';
import { getCurrenMapTime, mapActions } from '../map.reducer.ts';

describe('Map reducer test', () => {
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
