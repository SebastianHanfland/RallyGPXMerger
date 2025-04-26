import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { zipTracksReducer } from './tracks.reducer';
import { mapReducer } from './map.reducer';

const versionsReducer: Reducer = combineReducers({
    zipTracks: zipTracksReducer,
    map: mapReducer,
});

export const createComparisonStore = () =>
    configureStore({
        reducer: versionsReducer,
    });
export const comparisonStore = createComparisonStore();
