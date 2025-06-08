import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { CalculatedTracksState, State } from './types.ts';
import { storage } from './storage.ts';
import { getTrackCompositionFilterTerm } from './trackMerge.reducer.ts';
import { filterItems } from '../../utils/filterUtil.ts';
import { CalculatedTrack } from '../../common/types.ts';

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
        removeSingleCalculatedTrack: (state: CalculatedTracksState, action: PayloadAction<string>) => {
            state.tracks = state.tracks?.filter((track) => track.id !== action.payload);
        },
    },
});

export const calculatedTracksActions = calculatedTracksSlice.actions;
export const calculatedTracksReducer: Reducer<CalculatedTracksState> = calculatedTracksSlice.reducer;
const getBase = (state: State) => state.calculatedTracks;

export const getCalculatedTracks = (state: State) => getBase(state).tracks;

export const getFilteredCalculatedTracks = createSelector(
    getCalculatedTracks,
    getTrackCompositionFilterTerm,
    (tracks, filterTerm) => {
        return filterItems(filterTerm, tracks, (track: CalculatedTrack) => track.filename);
    }
);
