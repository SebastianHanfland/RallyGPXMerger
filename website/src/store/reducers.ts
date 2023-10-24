import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { storage } from './storage.ts';
import { gpxSegmentsReducer } from './gpxSegments.reducer.ts';
import { State } from './types.ts';
import { trackMergeReducer } from './trackMerge.reducer.ts';
import { calculatedTracksReducer } from './calculatedTracks.reducer.ts';
import { mapReducer } from './map.reducer.ts';

export const rootReducer: Reducer = combineReducers({
    gpxSegments: gpxSegmentsReducer,
    trackMerge: trackMergeReducer,
    calculatedTracks: calculatedTracksReducer,
    map: mapReducer,
});

export const storingReducer: Reducer = (state: State) => {
    if (state) {
        storage.save(state);
    }
    return state;
};
