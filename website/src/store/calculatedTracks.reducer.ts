import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { CalculatedTrack, CalculatedTracksState, State } from './types';
import { storage } from './storage.ts';

const initialState: CalculatedTracksState = {
    tracks: [],
};

const calculatedTracksSlice = createSlice({
    name: 'calculatedTracks',
    initialState: storage.load()?.calculatedTracks ?? initialState,
    reducers: {
        setCalculatedTracks: (state: CalculatedTracksState, action: PayloadAction<CalculatedTrack[]>) => {
            state.tracks = action.payload;
        },
        removeCalculatedTracks: (state: CalculatedTracksState) => {
            state.tracks = [];
        },
    },
});

export const calculatedTracksActions = calculatedTracksSlice.actions;
export const calculatedTracksReducer: Reducer<CalculatedTracksState> = calculatedTracksSlice.reducer;
const getBase = (state: State) => state.calculatedTracks;
export const getCalculatedTracks = (state: State) => getBase(state).tracks;
