import { Action, combineReducers, configureStore, Reducer, ThunkAction } from '@reduxjs/toolkit';
import reduceReducer from 'reduce-reducers';
import { State } from './types.ts';
import { gpxSegmentsReducer } from './gpxSegments.reducer.ts';
import { trackMergeReducer } from './trackMerge.reducer.ts';
import { calculatedTracksReducer } from './calculatedTracks.reducer.ts';
import { mapReducer } from './map.reducer.ts';
import { geoCodingReducer } from './geoCoding.reducer.ts';
import { geoCodingRequestsReducer } from './geoCodingRequests.reducer.ts';
import { storage } from './storage.ts';
import { layoutReducer } from './layout.reducer.ts';
import { pointsReducer } from './points.reducer.ts';
import { backendReducer } from './backend.reducer.ts';

const rootReducer: Reducer = combineReducers({
    backend: backendReducer,
    layout: layoutReducer,
    gpxSegments: gpxSegmentsReducer,
    trackMerge: trackMergeReducer,
    calculatedTracks: calculatedTracksReducer,
    map: mapReducer,
    points: pointsReducer,
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
