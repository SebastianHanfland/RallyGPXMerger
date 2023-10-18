import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { State, TrackMergeState } from './types';
import { storage } from './storage.ts';
import { v4 as uuidv4 } from 'uuid';

const initialState: TrackMergeState = {
    trackCompositions: [],
};

const trackMergeSlice = createSlice({
    name: 'trackMerge',
    initialState: storage.load()?.trackMerge ?? initialState,
    reducers: {
        addTrackComposition: (state: TrackMergeState) => {
            state.trackCompositions = [...state.trackCompositions, { id: uuidv4(), segmentIds: [] }];
        },
        removeTrackComposition: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.trackCompositions = state.trackCompositions.filter((track) => track.id !== action.payload);
        },
        setSegments: (state: TrackMergeState, action: PayloadAction<{ id: string; segments: string[] }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, segmentIds: action.payload.segments } : track
            );
        },
        setTrackName: (state: TrackMergeState, action: PayloadAction<{ id: string; trackName: string }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, name: action.payload.trackName } : track
            );
        },
        removeGpxSegment: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.trackCompositions = state.trackCompositions.map((track) => ({
                ...track,
                segmentIds: track.segmentIds.filter((segmentId) => segmentId !== action.payload),
            }));
        },
    },
});

export const trackMergeActions = trackMergeSlice.actions;
export const trackMergeReducer: Reducer<TrackMergeState> = trackMergeSlice.reducer;
const getBase = (state: State) => state.trackMerge;
export const getTrackCompositions = (state: State) => getBase(state).trackCompositions;
