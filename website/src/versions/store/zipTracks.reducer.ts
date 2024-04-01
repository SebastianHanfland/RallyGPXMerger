import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { VersionsState, ZipTracksState } from './types';
import { ZipTrack } from '../../common/types.ts';

const initialState: ZipTracksState = {
    tracks: {},
    selectedTracks: {},
    selectedVersions: [],
    isLoading: true,
};

const zipTracksSlice = createSlice({
    name: 'zipTracks',
    initialState: initialState,
    reducers: {
        setZipTracks: (state: ZipTracksState, action: PayloadAction<{ version: string; tracks: ZipTrack[] }>) => {
            const { version, tracks } = action.payload;
            state.tracks[version] = tracks;
        },
        setIsLoading: (state: ZipTracksState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        selectVersion: (state: ZipTracksState, action: PayloadAction<string>) => {
            const version = action.payload;
            if (state.selectedVersions.includes(version)) {
                state.selectedVersions = state.selectedVersions.filter((selected) => selected !== version);
            } else {
                state.selectedVersions = [...state.selectedVersions, version];
            }
        },
        setSelectVersions: (state: ZipTracksState, action: PayloadAction<string[]>) => {
            state.selectedVersions = action.payload;
        },
        removeZipTracks: (state: ZipTracksState) => {
            state.tracks = {};
        },
        setDisplayTracks: (
            state: ZipTracksState,
            action: PayloadAction<{ version: string; selectedTracks: string[] | undefined }>
        ) => {
            const { version, selectedTracks } = action.payload;
            state.selectedTracks[version] = selectedTracks;
        },
    },
});

export const zipTracksActions = zipTracksSlice.actions;
export const zipTracksReducer: Reducer<ZipTracksState> = zipTracksSlice.reducer;
const getBase = (state: VersionsState) => state.zipTracks;
export const getZipTracks = (state: VersionsState) => getBase(state).tracks;
export const getSingleZipTracks = (state: VersionsState) =>
    getBase(state).tracks[Object.keys(getBase(state).tracks)[0]];
export const getIsZipLoading = (state: VersionsState) => getBase(state).isLoading;
export const getSelectedVersions = (state: VersionsState) => getBase(state).selectedVersions;
export const getSelectedTracks = (state: VersionsState) => getBase(state).selectedTracks;
