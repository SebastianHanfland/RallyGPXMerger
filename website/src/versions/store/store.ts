import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { displayTracksReducer } from './displayTracksReducer.ts';
import { mapReducer } from './map.reducer.ts';

const versionsReducer: Reducer = combineReducers({
    tracks: displayTracksReducer,
    map: mapReducer,
});

export const createVersionsStore = () =>
    configureStore({
        reducer: versionsReducer,
    });
export const versionsStore = createVersionsStore();
