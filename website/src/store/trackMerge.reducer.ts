import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { State, TrackComposition, TrackMergeState } from './types';
import { storage } from './storage.ts';

const initialState: TrackMergeState = {
    trackCompositions: [],
};

const trackMergeSlice = createSlice({
    name: 'trackMerge',
    initialState: storage.load()?.trackMerge ?? initialState,
    reducers: {
        addTrackComposition: (state: TrackMergeState, action: PayloadAction<TrackComposition>) => {
            state.trackCompositions = [...state.trackCompositions, action.payload];
        },
        removeTrackComposition: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.trackCompositions = state.trackCompositions.filter((segment) => segment.id !== action.payload);
        },
    },
});

export const trackMergeActions = trackMergeSlice.actions;
export const trackMergeReducer: Reducer<TrackMergeState> = trackMergeSlice.reducer;
const getBase = (state: State) => state.trackMerge;
export const getTrackCompositions = (state: State) => getBase(state).trackCompositions;
