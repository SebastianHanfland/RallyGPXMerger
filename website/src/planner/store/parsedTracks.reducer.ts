import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { ParsedTrackState, State } from './types.ts';
import { ParsedTrack } from '../../common/types.ts';

const initialState: ParsedTrackState = {
    parsedTracks: [],
    parsedSegments: [],
    parsedConstructionSegments: [],
};

const parsedTracksSlice = createSlice({
    name: 'parsedTracks',
    initialState: initialState,
    reducers: {
        setParsedTracks: (state: ParsedTrackState, action: PayloadAction<ParsedTrack[]>) => {
            state.parsedTracks = action.payload;
        },
        setParsedSegments: (state: ParsedTrackState, action: PayloadAction<ParsedTrack[]>) => {
            state.parsedSegments = action.payload;
        },
        updateParsedSegment: (state: ParsedTrackState, action: PayloadAction<ParsedTrack>) => {
            state.parsedSegments = state.parsedSegments.map((segment) =>
                segment.id === action.payload.id ? action.payload : segment
            );
        },
        addParsedConstructionSegments: (state: ParsedTrackState, action: PayloadAction<ParsedTrack[]>) => {
            state.parsedConstructionSegments = [...(state.parsedConstructionSegments ?? []), ...action.payload];
        },
        removeParsedConstructionSegment: (state: ParsedTrackState, action: PayloadAction<string>) => {
            state.parsedConstructionSegments = state.parsedConstructionSegments?.filter(
                (segment) => segment.id !== action.payload
            );
        },
        clear: () => initialState,
    },
});

export const parsedTracksActions = parsedTracksSlice.actions;
export const parsedTracksReducer: Reducer<ParsedTrackState> = parsedTracksSlice.reducer;
const getBase = (state: State) => state.parsedTracks;
export const getParsedTracks = (state: State) => getBase(state)?.parsedTracks;
export const getParsedConstructionSegments = (state: State) => getBase(state)?.parsedConstructionSegments;
