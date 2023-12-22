import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { storage } from './storage.ts';
import { gpxSegmentsReducer } from './gpxSegments.reducer.ts';
import { State } from './types.ts';
import { trackMergeReducer } from './trackMerge.reducer.ts';
import { calculatedTracksReducer } from './calculatedTracks.reducer.ts';
import { mapReducer } from './map.reducer.ts';
import { geoCodingReducer } from './geoCoding.reducer.ts';
import { geoCodingRequestsReducer } from './geoCodingRequests.reducer.ts';
import { zipTracksReducer } from './zipTracks.reducer.ts';

export const rootReducer: Reducer = combineReducers({
    gpxSegments: gpxSegmentsReducer,
    trackMerge: trackMergeReducer,
    calculatedTracks: calculatedTracksReducer,
    map: mapReducer,
    geoCoding: geoCodingReducer,
    geoCodingRequests: geoCodingRequestsReducer,
});

export const storingReducer: Reducer = (state: State) => {
    if (state) {
        storage.save(state);
    }
    return state;
};

export const iFrameReducer: Reducer = combineReducers({
    zipTracks: zipTracksReducer,
    map: mapReducer,
});
