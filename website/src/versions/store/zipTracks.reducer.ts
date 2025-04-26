import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { VersionsState, ZipTracksState } from './types';
import { DisplayTrack } from '../../common/types.ts';

const initialState: ZipTracksState = {
    tracks: [],
    isLoading: true,
};

const displayTrackSlice = createSlice({
    name: 'displayTracks',
    initialState: initialState,
    reducers: {
        setZipTracks: (state: ZipTracksState, action: PayloadAction<DisplayTrack[]>) => {
            state.tracks = action.payload;
        },
        setIsLoading: (state: ZipTracksState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        removeZipTracks: (state: ZipTracksState) => {
            state.tracks = [];
        },
    },
});

export const zipTracksActions = displayTrackSlice.actions;
export const zipTracksReducer: Reducer<ZipTracksState> = displayTrackSlice.reducer;
const getBase = (state: VersionsState) => state.zipTracks;
export const getZipTracks = (state: VersionsState) => getBase(state).tracks;
export const getIsZipLoading = (state: VersionsState) => getBase(state).isLoading;
