import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { DisplayState, DisplayTracksState } from './types';
import { DisplayTrack, ParsedTrack } from '../../common/types.ts';
import { BlockedStreetInfo, TrackStreetInfo } from '../../planner/logic/resolving/types.ts';

const initialState: DisplayTracksState = {
    tracks: [],
    parsedTracks: [],
    isLoading: true,
};

const displayTrackSlice = createSlice({
    name: 'displayTracks',
    initialState: initialState,
    reducers: {
        setDisplayTracks: (state: DisplayTracksState, action: PayloadAction<DisplayTrack[]>) => {
            state.tracks = action.payload;
        },
        setParsedTracks: (state: DisplayTracksState, action: PayloadAction<ParsedTrack[]>) => {
            state.parsedTracks = action.payload;
        },
        setTitle: (state: DisplayTracksState, action: PayloadAction<string | undefined>) => {
            state.title = action.payload;
        },
        setEnrichedTrackStreetInfos: (state: DisplayTracksState, action: PayloadAction<TrackStreetInfo[]>) => {
            state.trackInfos = action.payload;
        },
        setBlockStreetInfos: (state: DisplayTracksState, action: PayloadAction<BlockedStreetInfo[]>) => {
            state.blockedStreetInfos = action.payload;
        },
        setPlanningLabel: (state: DisplayTracksState, action: PayloadAction<string | undefined>) => {
            state.planningLabel = action.payload;
        },
        setIsLoading: (state: DisplayTracksState, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        removeDisplayTracks: (state: DisplayTracksState) => {
            state.tracks = [];
        },
    },
});

export const displayTracksActions = displayTrackSlice.actions;
export const displayTracksReducer: Reducer<DisplayTracksState> = displayTrackSlice.reducer;
const getBase = (state: DisplayState) => state.tracks;
export const getDisplayTracks = (state: DisplayState) => getBase(state).tracks;
export const getParsedTracks = (state: DisplayState) => getBase(state).parsedTracks;
export const getDisplayTitle = (state: DisplayState) => getBase(state).title;
export const getIsDisplayLoading = (state: DisplayState) => getBase(state).isLoading;
export const getDisplayPlanningLabel = (state: DisplayState) => getBase(state).planningLabel;
export const getDisplayBlockedStreets = (state: DisplayState) => getBase(state).blockedStreetInfos;
export const getDisplayTrackStreetInfos = (state: DisplayState) => getBase(state).trackInfos;
