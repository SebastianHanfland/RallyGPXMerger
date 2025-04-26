import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { VersionsState, DisplayState } from './types';
import { DisplayTrack } from '../../common/types.ts';

const initialState: DisplayState = {
    tracks: [],
    isLoading: true,
};

const displayTrackSlice = createSlice({
    name: 'displayTracks',
    initialState: initialState,
    reducers: {
        setDisplayTracks: (state: DisplayState, action: PayloadAction<DisplayTrack[]>) => {
            state.tracks = action.payload;
        },
        setIsLoading: (state: DisplayState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        removeDisplayTracks: (state: DisplayState) => {
            state.tracks = [];
        },
    },
});

export const displayTracksActions = displayTrackSlice.actions;
export const displayTracksReducer: Reducer<DisplayState> = displayTrackSlice.reducer;
const getBase = (state: VersionsState) => state.tracks;
export const getDisplayTracks = (state: VersionsState) => getBase(state).tracks;
export const getIsDisplayLoading = (state: VersionsState) => getBase(state).isLoading;
