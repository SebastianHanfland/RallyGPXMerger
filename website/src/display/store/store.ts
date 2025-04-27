import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { displayTracksReducer } from './displayTracksReducer.ts';
import { mapReducer } from './map.reducer.ts';

const displayReducer: Reducer = combineReducers({
    tracks: displayTracksReducer,
    map: mapReducer,
});

export const createDisplayStore = () =>
    configureStore({
        reducer: displayReducer,
    });

export const displayStore = createDisplayStore();
export type DisplayDispatch = typeof displayStore.dispatch;
