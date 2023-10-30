import { createStore } from '../store.ts';
import {
    DEFAULT_AVERAGE_SPEED_IN_KM_H,
    getArrivalDateTime,
    getAverageSpeedInKmH,
    getParticipantsDelay,
    getTrackCompositions,
    trackMergeActions,
} from '../trackMerge.reducer.ts';
import { DELAY_PER_PERSON_IN_SECONDS } from '../../logic/helper/peopleDelayCounter.ts';

vi.mock('uuid', () => ({
    v4: () => '1',
}));

describe('TrackMerge reducer', () => {
    it('should create an empty composition and fill it', () => {
        // given
        const trackName = 'ABC';
        const store = createStore();
        expect(getTrackCompositions(store.getState())).toEqual([]);

        // when & then
        store.dispatch(trackMergeActions.addTrackComposition());
        expect(getTrackCompositions(store.getState())).toEqual([{ id: '1', segmentIds: [] }]);

        // when & then
        store.dispatch(trackMergeActions.setTrackName({ id: '1', trackName }));
        expect(getTrackCompositions(store.getState())).toEqual([{ id: '1', name: trackName, segmentIds: [] }]);

        // when & then
        store.dispatch(trackMergeActions.setSegments({ id: '1', segments: ['3', '4'] }));
        expect(getTrackCompositions(store.getState())).toEqual([{ id: '1', name: trackName, segmentIds: ['3', '4'] }]);

        // when & then
        store.dispatch(trackMergeActions.removeGpxSegment('3'));
        expect(getTrackCompositions(store.getState())).toEqual([{ id: '1', name: trackName, segmentIds: ['4'] }]);

        // when & then
        store.dispatch(trackMergeActions.removeTrackComposition('1'));
        expect(getTrackCompositions(store.getState())).toEqual([]);
    });

    it('should initialize full track', () => {
        // given
        const track = { id: '1', name: 'abc', segmentIds: ['2'] };
        const store = createStore();
        expect(getTrackCompositions(store.getState())).toEqual([]);

        // when
        store.dispatch(trackMergeActions.addTrackComposition(track));

        // then
        expect(getTrackCompositions(store.getState())).toEqual([track]);
    });

    it('should set and remove arrival date', () => {
        // given
        const arrivalDate = 'arrivalDate';
        const store = createStore();
        expect(getArrivalDateTime(store.getState())).toEqual(undefined);

        // when & then
        store.dispatch(trackMergeActions.setArrivalDateTime(arrivalDate));
        expect(getArrivalDateTime(store.getState())).toEqual(arrivalDate);

        // when & then
        store.dispatch(trackMergeActions.clear());
        expect(getArrivalDateTime(store.getState())).toEqual(undefined);
    });

    it('should set and reset participants delay', () => {
        // given
        const store = createStore();
        expect(getParticipantsDelay(store.getState())).toEqual(DELAY_PER_PERSON_IN_SECONDS);

        // when & then
        store.dispatch(trackMergeActions.setParticipantsDelays(0.4));
        expect(getParticipantsDelay(store.getState())).toEqual(0.4);

        // when & then
        store.dispatch(trackMergeActions.clear());
        expect(getParticipantsDelay(store.getState())).toEqual(DELAY_PER_PERSON_IN_SECONDS);
    });

    it('should set and reset average speed', () => {
        // given
        const store = createStore();
        expect(getAverageSpeedInKmH(store.getState())).toEqual(DEFAULT_AVERAGE_SPEED_IN_KM_H);

        // when & then
        store.dispatch(trackMergeActions.setAverageSpeed(15));
        expect(getAverageSpeedInKmH(store.getState())).toEqual(15);

        // when & then
        store.dispatch(trackMergeActions.clear());
        expect(getAverageSpeedInKmH(store.getState())).toEqual(DEFAULT_AVERAGE_SPEED_IN_KM_H);
    });
});
