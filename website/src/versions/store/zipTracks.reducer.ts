import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { IFrameState, ZipTrack, ZipTracksState } from '../../planner/store/types.ts';

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
const getBase = (state: IFrameState) => state.zipTracks;
export const getZipTracks = (state: IFrameState) => getBase(state).tracks;
export const getIsZipLoading = (state: IFrameState) => getBase(state).isLoading;
export const getSelectedVersions = (state: IFrameState) => getBase(state).selectedVersions;
export const getSelectedTracks = (state: IFrameState) => getBase(state).selectedTracks;
