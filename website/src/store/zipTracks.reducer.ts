import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { IFrameState, ZipTrack, ZipTracksState } from './types';

const initialState: ZipTracksState = {
    tracks: {},
};

const zipTracksSlice = createSlice({
    name: 'zipTracks',
    initialState: initialState,
    reducers: {
        setZipTracks: (state: ZipTracksState, action: PayloadAction<{ version: string; tracks: ZipTrack[] }>) => {
            const { version, tracks } = action.payload;
            state.tracks[version] = tracks;
        },
        removeZipTracks: (state: ZipTracksState) => {
            state.tracks = {};
        },
    },
});

export const zipTracksActions = zipTracksSlice.actions;
export const zipTracksReducer: Reducer<ZipTracksState> = zipTracksSlice.reducer;
const getBase = (state: IFrameState) => state.zipTracks;
export const getZipTracks = (state: IFrameState) => getBase(state).tracks;
