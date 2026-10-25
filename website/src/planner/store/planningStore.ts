import { Action, AnyAction, combineReducers, configureStore, Reducer, ThunkAction } from '@reduxjs/toolkit';
import reduceReducer from 'reduce-reducers';
import { State } from './types';
import { trackMergeReducer } from './trackMerge.reducer';
import { mapReducer } from './map.reducer';
import { geoCodingReducer } from './geoCoding.reducer';
import { storage } from './storage';
import { layoutReducer } from './layout.reducer';
import { pointsReducer } from './points.reducer';
import { backendReducer } from './backend.reducer';
import { toastsReducer } from './toast.reducer';
import { segmentDataReducer } from './segmentData.redux';
import { nodesReducer } from './nodes.reducer';
import { settingsReducer } from './settings.reducer';

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
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                immutableCheck: false,
                serializableCheck: false,
            }),
    });

export const planningStore = createPlanningStore();

export type AppDispatch = typeof planningStore.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, Action<string>>;
