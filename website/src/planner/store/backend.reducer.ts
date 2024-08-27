import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { BackendState, State } from './types.ts';

const initialState: BackendState = {
    isPlanningAlreadySaved: false,
};

const backendSlice = createSlice({
    name: 'backend',
    initialState: initialState,
    reducers: {
        setPlanningId: (state: BackendState, action: PayloadAction<string>) => {
            state.planningId = action.payload;
        },
        setPlanningPassword: (state: BackendState, action: PayloadAction<string>) => {
            state.planningPassword = action.payload;
        },
        setIsPlanningSaved: (state: BackendState, action: PayloadAction<boolean>) => {
            state.isPlanningAlreadySaved = action.payload;
        },
    },
});

export const backendActions = backendSlice.actions;
export const backendReducer: Reducer<BackendState> = backendSlice.reducer;
const getBase = (state: State) => state.backend;

export const getPlanningId = (state: State) => getBase(state).planningId;
export const getPlanningPassword = (state: State) => getBase(state).planningPassword;
export const getIsPlanningAlreadySaved = (state: State) => getBase(state).isPlanningAlreadySaved;
