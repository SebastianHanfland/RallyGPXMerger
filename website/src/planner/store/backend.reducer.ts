import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { BackendState, State } from './types.ts';
import { storage } from './storage.ts';
import { getBaseUrl } from '../../utils/linkUtil.ts';

const initialState: BackendState = {
    isPlanningAlreadySaved: false,
    hasChangesSinceLastUpload: false,
};

const backendSlice = createSlice({
    name: 'backend',
    initialState: storage.load()?.backend ?? initialState,
    reducers: {
        setPlanningId: (state: BackendState, action: PayloadAction<string>) => {
            state.planningId = action.payload;
            const newSearch = `?planning=${action.payload}`;
            history.replaceState(null, '', `${getBaseUrl()}${newSearch}`);
        },
        setPlanningPassword: (state: BackendState, action: PayloadAction<string>) => {
            state.planningPassword = action.payload;
        },
        setHasChangesSinceLastUpload: (state: BackendState, action: PayloadAction<boolean>) => {
            state.hasChangesSinceLastUpload = action.payload;
        },
        setIsPlanningSaved: (state: BackendState, action: PayloadAction<boolean>) => {
            state.isPlanningAlreadySaved = action.payload;
            if (!action.payload) {
                state.planningId = undefined;
                history.replaceState(null, '', `${getBaseUrl()}`);
            }
        },
        clear: () => initialState,
    },
});

export const backendActions = backendSlice.actions;
export const backendReducer: Reducer<BackendState> = backendSlice.reducer;
const getBase = (state: State) => state.backend;

export const getPlanningId = (state: State) => getBase(state).planningId;
export const getPlanningPassword = (state: State) => getBase(state).planningPassword;
export const getIsPlanningAlreadySaved = (state: State) => getBase(state).isPlanningAlreadySaved;
export const getHasChangesSinceLastUpload = (state: State) => getBase(state).hasChangesSinceLastUpload;
