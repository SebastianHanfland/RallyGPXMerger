import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { zipTracksReducer } from './zipTracks.reducer.ts';
import { mapReducer } from './map.reducer.ts';

const versionsReducer: Reducer = combineReducers({
    zipTracks: zipTracksReducer,
    map: mapReducer,
});

const createVersionsStore = () =>
    configureStore({
        reducer: versionsReducer,
    });
export const versionsStore = createVersionsStore();
