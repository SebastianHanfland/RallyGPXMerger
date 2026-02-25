import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { ComparisonState, ComparisonTrackState } from './types';
import { CalculatedTrack } from '../../common/types.ts';
import { ParsedGpxSegment } from '../../planner/store/types.ts';

const initialState: ComparisonState = {
    parsedTracks: {},
    trackInfo: {},
    participantsDelay: {},
    planningIds: [],
    selectedTracks: {},
    selectedVersions: [],
    constructions: [],
    isLoading: true,
};

const comparisonTracksSlice = createSlice({
    name: 'comparison',
    initialState: initialState,
    reducers: {
        setComparisonParsedTracks: (
            state: ComparisonState,
            action: PayloadAction<{ version: string; tracks: CalculatedTrack[] }>
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
        setDisplayTracks: (
            state: ComparisonState,
            action: PayloadAction<{ version: string; selectedTracks: string[] | undefined }>
        ) => {
            const { version, selectedTracks } = action.payload;
            state.selectedTracks[version] = selectedTracks;
        },
        addConstructions: (state: ComparisonState, action: PayloadAction<ParsedGpxSegment[]>) => {
            state.constructions = [...state.constructions, ...action.payload];
        },
        setParticipantsDelay: (
            state: ComparisonState,
            action: PayloadAction<{ version: string; participantsDelay: number | undefined }>
        ) => {
            const { version, participantsDelay } = action.payload;
            state.participantsDelay[version] = participantsDelay;
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
export const getComparisonParsedTracks = (state: ComparisonTrackState) => getBase(state).parsedTracks;
export const getPlanningIds = (state: ComparisonTrackState) => getBase(state).planningIds;
export const getIsComparisonLoading = (state: ComparisonTrackState) => getBase(state).isLoading;
export const getSelectedVersions = (state: ComparisonTrackState) => getBase(state).selectedVersions;
export const getSelectedTracks = (state: ComparisonTrackState) => getBase(state).selectedTracks;
export const getComparisonTrackTitles = (state: ComparisonTrackState) => getBase(state).trackInfo;
export const getComparisonParticipantsDelay = (state: ComparisonTrackState) => getBase(state).participantsDelay;
export const getComparisonMapConstructions = (state: ComparisonTrackState) => getBase(state).constructions;
