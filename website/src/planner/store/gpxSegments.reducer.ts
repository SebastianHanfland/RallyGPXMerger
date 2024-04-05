import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { GpxSegmentsState, State } from './types.ts';
import { storage } from './storage.ts';
import { filterItems } from '../../utils/filterUtil.ts';
import { optionallyDecompress } from './compressHelper.ts';
import { GpxSegment } from '../../common/types.ts';

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
        flipGpxSegment: (state: GpxSegmentsState, action: PayloadAction<string>) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload ? { ...segment, flipped: !segment.flipped } : segment
            );
        },
        changeGpxSegmentContent: (
            state: GpxSegmentsState,
            action: PayloadAction<{ id: string; newContent: string }>
        ) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, content: action.payload.newContent } : segment
            );
        },
        setSegmentStreetsResolved: (
            state: GpxSegmentsState,
            action: PayloadAction<{ id: string; streetsResolved: boolean }>
        ) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id
                    ? { ...segment, streetsResolved: action.payload.streetsResolved }
                    : segment
            );
        },
        setReplaceProcess: (
            state: GpxSegmentsState,
            action: PayloadAction<{ targetSegment: string; replacementSegments: GpxSegment[] } | undefined>
        ) => {
            state.replaceProcess = action.payload;
        },
        setFilename: (state: GpxSegmentsState, action: PayloadAction<{ id: string; filename: string }>) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, filename: action.payload.filename } : segment
            );
        },
        setFilterTerm: (state: GpxSegmentsState, action: PayloadAction<string | undefined>) => {
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
        setAllSegmentsToUnresolved: (state: GpxSegmentsState) => {
            state.segments = state.segments.map((segment) => ({ ...segment, streetsResolved: undefined }));
        },
        clearGpxSegments: () => initialState,
    },
});

export const gpxSegmentsActions = gpxSegmentsSlice.actions;
export const gpxSegmentsReducer: Reducer<GpxSegmentsState> = gpxSegmentsSlice.reducer;
const getBase = (state: State) => state.gpxSegments;

export const getDecompressedGpxSegments = createSelector(
    (state: State) => getBase(state).segments,
    (segments) => {
        return segments?.map((segment) => ({ ...segment, content: optionallyDecompress(segment.content) }));
    }
);
export const getGpxSegments = getDecompressedGpxSegments;
export const getConstructionSegments = (state: State) => getBase(state).constructionSegments ?? [];
export const getSegmentFilterTerm = (state: State) => getBase(state).segmentFilterTerm;
export const getReplaceProcess = (state: State) => getBase(state).replaceProcess;
export const getSegmentSpeeds = (state: State) => getBase(state).segmentSpeeds ?? {};

export const getFilteredGpxSegments = createSelector(getGpxSegments, getSegmentFilterTerm, (segments, filterTerm) => {
    return filterItems(filterTerm, segments, (track: GpxSegment) => track.filename);
});
