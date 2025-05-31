import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { ClickOnSegment, ParsedGpxSegment, SegmentDataState, State } from './types.ts';
import { filterItems } from '../../utils/filterUtil.ts';
import { GpxSegment } from '../../common/types.ts';
import { getDecompressedGpxSegments } from '../store/gpxSegments.reducer.ts';

const initialState: SegmentDataState = {
    segments: [],
    pois: [],
    constructionSegments: [],
    segmentSpeeds: {},
};

const gpxSegmentsSlice = createSlice({
    name: 'segmentData',
    initialState: initialState,
    reducers: {
        addGpxSegments: (state: SegmentDataState, action: PayloadAction<ParsedGpxSegment[]>) => {
            state.segments = [...state.segments, ...action.payload];
        },
        removeGpxSegment: (state: SegmentDataState, action: PayloadAction<string>) => {
            state.segments = state.segments.filter((segment) => segment.id !== action.payload);
        },
        flipGpxSegment: (state: SegmentDataState, action: PayloadAction<string>) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload ? { ...segment, flipped: !segment.flipped } : segment
            );
        },
        changeGpxSegmentContent: (
            state: SegmentDataState,
            action: PayloadAction<{ id: string; newContent: string }>
        ) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, content: action.payload.newContent } : segment
            );
        },
        setSegmentStreetsResolved: (
            state: SegmentDataState,
            action: PayloadAction<{ id: string; streetsResolved: boolean }>
        ) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id
                    ? { ...segment, streetsResolved: action.payload.streetsResolved }
                    : segment
            );
        },
        setReplaceProcess: (
            state: SegmentDataState,
            action: PayloadAction<{ targetSegment: string; replacementSegments: ParsedGpxSegment[] } | undefined>
        ) => {
            state.replaceProcess = action.payload;
        },
        setFilename: (state: SegmentDataState, action: PayloadAction<{ id: string; filename: string }>) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, filename: action.payload.filename } : segment
            );
        },
        setFilterTerm: (state: SegmentDataState, action: PayloadAction<string | undefined>) => {
            state.segmentFilterTerm = action.payload;
        },
        setSegmentSpeeds: (state: SegmentDataState, action: PayloadAction<{ id: string; speed?: number }>) => {
            const { id, speed } = action.payload;
            if (!state.segmentSpeeds) {
                state.segmentSpeeds = { [id]: speed };
            } else {
                state.segmentSpeeds[id] = speed;
            }
        },
        addConstructionSegments: (state: SegmentDataState, action: PayloadAction<ParsedGpxSegment[]>) => {
            state.constructionSegments = [...(state.constructionSegments ?? []), ...action.payload];
        },
        removeConstructionSegment: (state: SegmentDataState, action: PayloadAction<string>) => {
            state.constructionSegments = state.constructionSegments?.filter((segment) => segment.id !== action.payload);
        },
        setAllSegmentsToUnresolved: (state: SegmentDataState) => {
            state.segments = state.segments.map((segment) => ({ ...segment, streetsResolved: false }));
        },
        setClickOnSegment: (state: SegmentDataState, action: PayloadAction<ClickOnSegment | undefined>) => {
            state.clickOnSegment = action.payload;
        },
        clearGpxSegments: () => initialState,
    },
});

const defaultSegmentSpeeds: Record<string, number | undefined> = {};
export const gpxSegmentsActions = gpxSegmentsSlice.actions;
export const segmentDataRedux: Reducer<SegmentDataState> = gpxSegmentsSlice.reducer;
const getBase = (state: State) => state.gpxSegments;

export const getGpxSegments = getDecompressedGpxSegments;
export const getConstructionSegments = (state: State) => getBase(state).constructionSegments;
export const getSegmentFilterTerm = (state: State) => getBase(state).segmentFilterTerm;
export const getReplaceProcess = (state: State) => getBase(state).replaceProcess;
export const getSegmentSpeeds = (state: State) => getBase(state).segmentSpeeds ?? defaultSegmentSpeeds;
export const getClickOnSegment = (state: State) => getBase(state).clickOnSegment;

export const getFilteredGpxSegments = createSelector(getGpxSegments, getSegmentFilterTerm, (segments, filterTerm) => {
    return filterItems(filterTerm, segments, (track: GpxSegment) => track.filename);
});
