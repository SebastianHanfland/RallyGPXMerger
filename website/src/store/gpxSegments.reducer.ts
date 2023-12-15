import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { GpxSegment, GpxSegmentsState, State } from './types';
import { storage } from './storage.ts';
import { filterItems } from '../utils/filterUtil.ts';

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
        changeGpxSegmentContent: (
            state: GpxSegmentsState,
            action: PayloadAction<{ id: string; newContent: string }>
        ) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, content: action.payload.newContent } : segment
            );
        },
        setPeopleCountStart: (state: GpxSegmentsState, action: PayloadAction<{ id: string; count: number }>) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, peopleCountStart: action.payload.count } : segment
            );
        },
        setPeopleCountEnd: (state: GpxSegmentsState, action: PayloadAction<{ id: string; count: number }>) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, peopleCountEnd: action.payload.count } : segment
            );
        },
        setFilename: (state: GpxSegmentsState, action: PayloadAction<{ id: string; filename: string }>) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, filename: action.payload.filename } : segment
            );
        },
        setFilterTerm: (state: GpxSegmentsState, action: PayloadAction<string>) => {
            state.segmentFilterTerm = action.payload;
        },
        setSegmentSpeeds: (state: GpxSegmentsState, action: PayloadAction<{ id: string; speed?: number }>) => {
            const { id, speed } = action.payload;
            if (!state.segmentSpeeds) {
                state.segmentSpeeds = { [id]: speed };
            } else {
                state.segmentSpeeds[id] = speed;
            }
        },
        addConstructionSegments: (state: GpxSegmentsState, action: PayloadAction<GpxSegment[]>) => {
            state.constructionSegments = [...(state.constructionSegments ?? []), ...action.payload];
        },
        removeConstructionSegment: (state: GpxSegmentsState, action: PayloadAction<string>) => {
            state.constructionSegments = state.constructionSegments?.filter((segment) => segment.id !== action.payload);
        },
        clearGpxSegments: () => initialState,
    },
});

export const gpxSegmentsActions = gpxSegmentsSlice.actions;
export const gpxSegmentsReducer: Reducer<GpxSegmentsState> = gpxSegmentsSlice.reducer;
const getBase = (state: State) => state.gpxSegments;
export const getGpxSegments = (state: State) => getBase(state).segments;
export const getConstructionSegments = (state: State) => getBase(state).constructionSegments ?? [];
export const getSegmentFilterTerm = (state: State) => getBase(state).segmentFilterTerm;
export const getSegmentSpeeds = (state: State) => getBase(state).segmentSpeeds ?? {};

export const getFilteredGpxSegments = createSelector(getGpxSegments, getSegmentFilterTerm, (segments, filterTerm) => {
    return filterItems(filterTerm, segments, (track: GpxSegment) => track.filename);
});
