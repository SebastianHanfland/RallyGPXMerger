import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { storage } from './storage.ts';
import { gpxSegmentsReducer } from './gpxSegments.reducer.ts';
import { State } from './types.ts';
import { trackMergeReducer } from './trackMerge.reducer.ts';

export const rootReducer: Reducer = combineReducers({
    gpxSegments: gpxSegmentsReducer,
    trackMerge: trackMergeReducer,
});

export const storingReducer: Reducer = (state: State) => {
    if (state) {
        storage.save(state);
    }
    return state;
};
