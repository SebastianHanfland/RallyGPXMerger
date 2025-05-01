import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { ParsedTrackState, State } from './types.ts';
import { ParsedTrack } from '../../common/types.ts';

const initialState: ParsedTrackState = {
    parsedTracks: [],
    parsedSegments: [],
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
    },
});

export const parsedTracksActions = parsedTracksSlice.actions;
export const parsedTracksReducer: Reducer<ParsedTrackState> = parsedTracksSlice.reducer;
const getBase = (state: State) => state.parsedTracks;
export const getParsedTracks = (state: State) => getBase(state)?.parsedTracks;
export const getParsedSegments = (state: State) => getBase(state)?.parsedSegments;
