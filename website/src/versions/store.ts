import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { zipTracksReducer } from '../store/zipTracks.reducer.ts';
import { mapReducer } from '../store/map.reducer.ts';

const iFrameReducer: Reducer = combineReducers({
    zipTracks: zipTracksReducer,
    map: mapReducer,
});

const createIframeStore = () =>
    configureStore({
        reducer: iFrameReducer,
    });
export const iframeStore = createIframeStore();
