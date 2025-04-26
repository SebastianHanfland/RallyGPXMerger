import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { ComparisonState, ZipTracksState } from './types';
import { DisplayTrack } from '../../common/types.ts';

const initialState: ZipTracksState = {
    tracks: {},
    trackInfo: {},
    selectedTracks: {},
    selectedVersions: [],
    isLoading: true,
};

const comparisonTracksSlice = createSlice({
    name: 'zipTracks',
    initialState: initialState,
    reducers: {
        setZipTracks: (state: ZipTracksState, action: PayloadAction<{ version: string; tracks: DisplayTrack[] }>) => {
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
            state.selectedVersions = [...state.selectedVersions, ...action.payload];
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
        setDisplayInformation: (
            state: ZipTracksState,
            action: PayloadAction<{ version: string; versionTitle: string | undefined }>
        ) => {
            const { version, versionTitle } = action.payload;
            if (state.trackInfo === undefined) {
                state.trackInfo = {};
            }
            state.trackInfo[version] = versionTitle;
        },
    },
});

export const zipTracksActions = comparisonTracksSlice.actions;
export const zipTracksReducer: Reducer<ZipTracksState> = comparisonTracksSlice.reducer;
const getBase = (state: ComparisonState) => state.zipTracks;
export const getZipTracks = (state: ComparisonState) => getBase(state).tracks;
export const getIsZipLoading = (state: ComparisonState) => getBase(state).isLoading;
export const getSelectedVersions = (state: ComparisonState) => getBase(state).selectedVersions;
export const getSelectedTracks = (state: ComparisonState) => getBase(state).selectedTracks;
export const getTrackInfo = (state: ComparisonState) => getBase(state).trackInfo;
