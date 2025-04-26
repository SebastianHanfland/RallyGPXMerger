import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { comparisonTracksReducer } from './tracks.reducer';
import { mapReducer } from './map.reducer';

const versionsReducer: Reducer = combineReducers({
    tracks: comparisonTracksReducer,
    map: mapReducer,
});

export const createComparisonStore = () =>
    configureStore({
        reducer: versionsReducer,
    });
export const comparisonStore = createComparisonStore();
