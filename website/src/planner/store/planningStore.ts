import { Action, AnyAction, combineReducers, configureStore, Reducer, ThunkAction } from '@reduxjs/toolkit';
import reduceReducer from 'reduce-reducers';
import { State } from './types.ts';
import { trackMergeReducer } from './trackMerge.reducer.ts';
import { mapReducer } from './map.reducer.ts';
import { geoCodingReducer } from './geoCoding.reducer.ts';
import { storage } from './storage.ts';
import { layoutReducer } from './layout.reducer.ts';
import { pointsReducer } from './points.reducer.ts';
import { backendReducer } from './backend.reducer.ts';
import { toastsReducer } from './toast.reducer.ts';
import { segmentDataReducer } from './segmentData.redux.ts';
import { nodesReducer } from './nodes.reducer.ts';
import { settingsReducer } from './settings.reducer.ts';

const rootReducer: Reducer = combineReducers({
    backend: backendReducer,
    layout: layoutReducer,
    segmentData: segmentDataReducer,
    trackMerge: trackMergeReducer,
    settings: settingsReducer,
    nodes: nodesReducer,
    map: mapReducer,
    points: pointsReducer,
    geoCoding: geoCodingReducer,
    toasts: toastsReducer,
});
const storingReducer: Reducer = (state: State) => {
    if (state) {
        storage.save({ ...state });
    }
    return state;
};

const stateSettingReducer: Reducer = (state: State, action: AnyAction) => {
    if (action.type === 'wholeState') {
        return action.payload;
    }
    return state;
};

export const createPlanningStore = () =>
    configureStore({
        reducer: reduceReducer(...[rootReducer, storingReducer, stateSettingReducer]),
    });

export const planningStore = createPlanningStore();

export type AppDispatch = typeof planningStore.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, Action<string>>;
