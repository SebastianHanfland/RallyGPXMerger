import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import reduceReducer from 'reduce-reducers';
import { rootReducer, storingReducer } from './reducers';

export const createStore = () =>
    configureStore({
        reducer: reduceReducer(rootReducer, storingReducer),
    });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export type State = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, Action<string>>;
