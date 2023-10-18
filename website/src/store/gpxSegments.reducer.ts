import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { GpxSegment, GpxSegmentsState, State } from './types';
import { storage } from './storage.ts';

const initialState: GpxSegmentsState = {
    segments: [],
};

const gpxSegmentsSlice = createSlice({
    name: 'gpxSegments',
    initialState: storage.load()?.gpxSegments ?? initialState,
    reducers: {
        addGpxSegments: (state: GpxSegmentsState, action: PayloadAction<GpxSegment[]>) => {
            state.segments = [...state.segments, ...action.payload];
        },
        removeGpxSegment: (state: GpxSegmentsState, action: PayloadAction<string>) => {
            state.segments = state.segments.filter((segment) => segment.id !== action.payload);
        },
        clearGpxSegments: (state: GpxSegmentsState) => {
            state.segments = [];
        },
    },
});

export const gpxSegmentsActions = gpxSegmentsSlice.actions;
export const gpxSegmentsReducer: Reducer<GpxSegmentsState> = gpxSegmentsSlice.reducer;
const getBase = (state: State) => state.gpxSegments;
export const getGpxSegments = (state: State) => getBase(state).segments;
