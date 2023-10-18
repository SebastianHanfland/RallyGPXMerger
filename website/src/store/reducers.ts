import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { storage } from './storage.ts';
import { gpxSegmentsReducer } from './gpxSegments.reducer.ts';
import { State } from './types.ts';

export const rootReducer: Reducer = combineReducers({
    gpxSegments: gpxSegmentsReducer,
});

export const storingReducer: Reducer = (state: State) => {
    if (state) {
        storage.save(state);
    }
    return state;
};
