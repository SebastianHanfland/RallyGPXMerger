import { combineReducers, configureStore, Reducer } from '@reduxjs/toolkit';
import { displayMapReducer } from './displayMapReducer';
import { planningReducer } from './displayTracksReducer';

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
