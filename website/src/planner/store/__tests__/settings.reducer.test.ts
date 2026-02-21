import { createPlanningStore } from '../planningStore.ts';

import { DEFAULT_AVERAGE_SPEED_IN_KM_H, DELAY_PER_PERSON_IN_SECONDS } from '../constants.ts';
import {
    getArrivalDateTime,
    getAverageSpeedInKmH,
    getParticipantsDelay,
    settingsActions,
} from '../settings.reducer.ts';

describe('Settings reducer', () => {
    it('should set and remove arrival date', () => {
        // given
        const arrivalDate = 'arrivalDate';
        const store = createPlanningStore();
        expect(getArrivalDateTime(store.getState())).toEqual(undefined);

        // when & then
        store.dispatch(settingsActions.setArrivalDateTime(arrivalDate));
        expect(getArrivalDateTime(store.getState())).toEqual(arrivalDate);

        // when & then
        store.dispatch(settingsActions.clear());
        expect(getArrivalDateTime(store.getState())).toEqual(undefined);
    });

    it('should set and reset participants delay', () => {
        // given
        const store = createPlanningStore();
        expect(getParticipantsDelay(store.getState())).toEqual(DELAY_PER_PERSON_IN_SECONDS);

        // when & then
        store.dispatch(settingsActions.setParticipantsDelays(0.4));
        expect(getParticipantsDelay(store.getState())).toEqual(0.4);

        // when & then
        store.dispatch(settingsActions.clear());
        expect(getParticipantsDelay(store.getState())).toEqual(DELAY_PER_PERSON_IN_SECONDS);
    });

    it('should set and reset average speed', () => {
        // given
        const store = createPlanningStore();
        expect(getAverageSpeedInKmH(store.getState())).toEqual(DEFAULT_AVERAGE_SPEED_IN_KM_H);

        // when & then
        store.dispatch(settingsActions.setAverageSpeed(15));
        expect(getAverageSpeedInKmH(store.getState())).toEqual(15);

        // when & then
        store.dispatch(settingsActions.clear());
        expect(getAverageSpeedInKmH(store.getState())).toEqual(DEFAULT_AVERAGE_SPEED_IN_KM_H);
    });
});
