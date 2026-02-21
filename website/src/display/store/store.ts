import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { displayMapReducer } from './displayMapReducer.ts';
import { planningReducer } from './displayTracksReducer.ts';

const displayReducer: Reducer = combineReducers({
    displayMap: displayMapReducer,
    planning: planningReducer,
});

export const createDisplayStore = () =>
    configureStore({
        reducer: displayReducer,
    });

export const displayStore = createDisplayStore();
export type DisplayDispatch = typeof displayStore.dispatch;
