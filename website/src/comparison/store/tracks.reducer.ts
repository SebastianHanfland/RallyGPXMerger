import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { ComparisonTrackState, ComparisonState } from './types';
import { DisplayTrack, ParsedTrack } from '../../common/types.ts';

const initialState: ComparisonState = {
    tracks: {},
    parsedTracks: {},
    trackInfo: {},
    planningIds: [],
    selectedTracks: {},
    selectedVersions: [],
    isLoading: true,
};

const comparisonTracksSlice = createSlice({
    name: 'comparison',
    initialState: initialState,
    reducers: {
        setComparisonTracks: (
            state: ComparisonState,
            action: PayloadAction<{ version: string; tracks: DisplayTrack[] }>
        ) => {
            const { version, tracks } = action.payload;
            state.tracks[version] = tracks;
        },
        setComparisonParsedTracks: (
            state: ComparisonState,
            action: PayloadAction<{ version: string; tracks: ParsedTrack[] }>
        ) => {
            const { version, tracks } = action.payload;
            state.parsedTracks[version] = tracks;
        },
        setPlanningIds: (state: ComparisonState, action: PayloadAction<string[]>) => {
            state.planningIds = action.payload;
        },
        setIsLoading: (state: ComparisonState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        selectVersion: (state: ComparisonState, action: PayloadAction<string>) => {
            const version = action.payload;
            if (state.selectedVersions.includes(version)) {
                state.selectedVersions = state.selectedVersions.filter((selected) => selected !== version);
            } else {
                state.selectedVersions = [...state.selectedVersions, version];
            }
        },
        setSelectVersions: (state: ComparisonState, action: PayloadAction<string[]>) => {
            state.selectedVersions = [...state.selectedVersions, ...action.payload];
        },
        removeComparisonTracks: (state: ComparisonState) => {
            state.tracks = {};
        },
        setDisplayTracks: (
            state: ComparisonState,
            action: PayloadAction<{ version: string; selectedTracks: string[] | undefined }>
        ) => {
            const { version, selectedTracks } = action.payload;
            state.selectedTracks[version] = selectedTracks;
        },
        setDisplayInformation: (
            state: ComparisonState,
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

export const comparisonActions = comparisonTracksSlice.actions;
export const comparisonTracksReducer: Reducer<ComparisonState> = comparisonTracksSlice.reducer;
const getBase = (state: ComparisonTrackState) => state.tracks;
export const getComparisonTracks = (state: ComparisonTrackState) => getBase(state).tracks;
export const getComparisonParsedTracks = (state: ComparisonTrackState) => getBase(state).tracks;
export const getPlanningIds = (state: ComparisonTrackState) => getBase(state).planningIds;
export const getIsComparisonLoading = (state: ComparisonTrackState) => getBase(state).isLoading;
export const getSelectedVersions = (state: ComparisonTrackState) => getBase(state).selectedVersions;
export const getSelectedTracks = (state: ComparisonTrackState) => getBase(state).selectedTracks;
export const getTrackInfo = (state: ComparisonTrackState) => getBase(state).trackInfo;
