import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { BackendState, State } from './types.ts';
import { storage } from './storage.ts';
import { getBaseUrl } from '../../utils/linkUtil.ts';

const initialState: BackendState = {
    isPlanningAlreadySaved: false,
    hasChangesSinceLastUpload: false,
};

function setPlanningIdInUrl(currentSearch: string, newSearch: string) {
    if (currentSearch.includes('planning=')) {
        return `${getBaseUrl()}${'?section=gps'}${newSearch}`;
    }
    return `${getBaseUrl()}${currentSearch}${newSearch}`;
}

const backendSlice = createSlice({
    name: 'backend',
    initialState: storage.load()?.backend ?? initialState,
    reducers: {
        setPlanningId: (state: BackendState, action: PayloadAction<string>) => {
            const planningId = action.payload;
            state.planningId = planningId;
            const newSearch = `&planning=${planningId}`;
            const currentSearch = window.location.search;
            if (!currentSearch.includes(planningId)) {
                history.replaceState(null, '', setPlanningIdInUrl(currentSearch, newSearch));
            }
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
            }
        },
        clear: () => initialState,
    },
});

export const backendActions = backendSlice.actions;
export const backendReducer: Reducer<BackendState> = backendSlice.reducer;
const getBase = (state: State) => state.backend;

export const getPlanningId = (state: State) => getBase(state)?.planningId;
export const getPlanningPassword = (state: State) => getBase(state)?.planningPassword;
export const getIsPlanningAlreadySaved = (state: State) => getBase(state)?.isPlanningAlreadySaved;
export const getHasChangesSinceLastUpload = (state: State) => getBase(state)?.hasChangesSinceLastUpload;
