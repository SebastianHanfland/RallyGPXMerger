import { combineReducers, Reducer } from '@reduxjs/toolkit';
import { State } from './store.ts';
import { storage } from './storage.ts';

export const rootReducer: Reducer = combineReducers({
    // Dummy
    files: (state: State) => state,
});

export const storingReducer: Reducer = (state: State) => {
    if (state) {
        storage.save(state);
    }
    return state;
};
