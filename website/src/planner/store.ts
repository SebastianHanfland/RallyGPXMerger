import { Action, combineReducers, configureStore, Reducer, ThunkAction } from '@reduxjs/toolkit';
import reduceReducer from 'reduce-reducers';
import { State } from '../store/types.ts';
import { gpxSegmentsReducer } from '../store/gpxSegments.reducer.ts';
import { trackMergeReducer } from '../store/trackMerge.reducer.ts';
import { calculatedTracksReducer } from '../store/calculatedTracks.reducer.ts';
import { mapReducer } from '../store/map.reducer.ts';
import { geoCodingReducer } from '../store/geoCoding.reducer.ts';
import { geoCodingRequestsReducer } from '../store/geoCodingRequests.reducer.ts';
import { storage } from '../store/storage.ts';

const rootReducer: Reducer = combineReducers({
    gpxSegments: gpxSegmentsReducer,
    trackMerge: trackMergeReducer,
    calculatedTracks: calculatedTracksReducer,
    map: mapReducer,
    geoCoding: geoCodingReducer,
    geoCodingRequests: geoCodingRequestsReducer,
});
const storingReducer: Reducer = (state: State) => {
    if (state) {
        storage.save(state);
    }
    return state;
};
export const createStore = () =>
    configureStore({
        reducer: reduceReducer(rootReducer, storingReducer),
    });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, Action<string>>;
