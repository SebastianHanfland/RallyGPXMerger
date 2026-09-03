import { createPlanningStore } from '../planningStore.ts';
import {
    getCurrenMapTime,
    getShowBlockStreets,
    getShowCalculatedTracks,
    getShowGpxSegments,
    mapActions,
} from '../map.reducer.ts';

describe('Map reducer test', () => {
    it('should set map time', () => {
        // given
        const store = createPlanningStore();
        expect(getCurrenMapTime(store.getState())).toEqual(0);

        // when
        store.dispatch(mapActions.setCurrentTime(1234));

        // then
        expect(getCurrenMapTime(store.getState())).toEqual(1234);
    });

    it('should allow only one primary map content type at a time', () => {
        const store = createPlanningStore();

        store.dispatch(mapActions.setPrimaryMapContent('segments'));
        expect(getShowGpxSegments(store.getState())).toBe(true);
        expect(getShowCalculatedTracks(store.getState())).toBe(false);
        expect(getShowBlockStreets(store.getState())).toBe(false);

        store.dispatch(mapActions.setPrimaryMapContent('tracks'));
        expect(getShowGpxSegments(store.getState())).toBe(false);
        expect(getShowCalculatedTracks(store.getState())).toBe(true);
        expect(getShowBlockStreets(store.getState())).toBe(false);

        store.dispatch(mapActions.setPrimaryMapContent('streets'));
        expect(getShowGpxSegments(store.getState())).toBe(false);
        expect(getShowCalculatedTracks(store.getState())).toBe(false);
        expect(getShowBlockStreets(store.getState())).toBe(true);
    });
});
