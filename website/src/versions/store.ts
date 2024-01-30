import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { zipTracksReducer } from '../store/zipTracks.reducer.ts';
import { mapReducer } from '../planner/store/map.reducer.ts';

const versionsReducer: Reducer = combineReducers({
    zipTracks: zipTracksReducer,
    map: mapReducer,
});

const createVersionsStore = () =>
    configureStore({
        reducer: versionsReducer,
    });
export const versionsStore = createVersionsStore();
