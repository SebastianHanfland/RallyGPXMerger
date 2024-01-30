import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import reduceReducer from 'reduce-reducers';
import { rootReducer, storingReducer } from '../store/reducers.ts';
import { State } from '../store/types.ts';

export const createStore = () =>
    configureStore({
        reducer: reduceReducer(rootReducer, storingReducer),
    });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, Action<string>>;
