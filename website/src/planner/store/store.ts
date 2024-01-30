import { Action, combineReducers, configureStore, Reducer, ThunkAction } from '@reduxjs/toolkit';
import reduceReducer from 'reduce-reducers';
import { State } from '../../store/types.ts';
import { gpxSegmentsReducer } from './gpxSegments.reducer.ts';
import { trackMergeReducer } from './trackMerge.reducer.ts';
import { calculatedTracksReducer } from './calculatedTracks.reducer.ts';
import { mapReducer } from './map.reducer.ts';
import { geoCodingReducer } from './geoCoding.reducer.ts';
import { geoCodingRequestsReducer } from './geoCodingRequests.reducer.ts';
import { storage } from './storage.ts';

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
