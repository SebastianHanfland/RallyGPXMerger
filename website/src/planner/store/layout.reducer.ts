import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { LayoutState, State } from './types.ts';
import { storage } from './storage.ts';
import { Sections } from '../layout/types.ts';

const initialState: LayoutState = {
    selectedSection: 'start',
};

const layoutSlice = createSlice({
    name: 'calculatedTracks',
    initialState: storage.load()?.layout ?? initialState,
    reducers: {
        selectSection: (state: LayoutState, action: PayloadAction<Sections>) => {
            state.selectedSection = action.payload;
        },
    },
});

export const layoutActions = layoutSlice.actions;
export const layoutReducer: Reducer<LayoutState> = layoutSlice.reducer;
const getBase = (state: State) => state.layout;

export const getSelectionSection = (state: State) => getBase(state).selectedSection;
