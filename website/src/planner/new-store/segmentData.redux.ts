import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { filterItems } from '../../utils/filterUtil.ts';
import { ClickOnSegment, ParsedGpxSegment, ParsedPoint, SegmentDataState, State } from '../store/types.ts';
import { storage } from '../store/storage.ts';
import { generateParsedPointsWithTimeInSeconds } from '../logic/merge/speedSimulatorTimeInSeconds.ts';

const initialState: SegmentDataState = {
    segments: [],
    pois: [],
    constructionSegments: [],
    segmentSpeeds: {},
    streetLookup: {},
    postCodeLookup: {},
    districtLookup: {},
};

const segmentDataSlice = createSlice({
    name: 'segmentData',
    initialState: storage.load()?.segmentData ?? initialState,
    reducers: {
        addGpxSegments: (state: SegmentDataState, action: PayloadAction<ParsedGpxSegment[]>) => {
            state.segments = [...state.segments, ...action.payload];
        },
        addStreetLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string>>) => {
            state.streetLookup = { ...state.streetLookup, ...action.payload };
        },
        addPostCodeLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string>>) => {
            state.postCodeLookup = { ...state.postCodeLookup, ...action.payload };
        },
        addDistrictLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string>>) => {
            state.districtLookup = { ...state.districtLookup, ...action.payload };
        },
        removeGpxSegment: (state: SegmentDataState, action: PayloadAction<string>) => {
            state.segments = state.segments.filter((segment) => segment.id !== action.payload);
        },
        flipGpxSegment: (
            state: SegmentDataState,
            action: PayloadAction<{ segmentId: string; averageSpeed: number }>
        ) => {
            state.segments = state.segments.map((segment) => {
                if (segment.id !== action.payload.segmentId) {
                    return segment;
                }
                const speed = state.segmentSpeeds[segment.id] ?? action.payload.averageSpeed;
                return {
                    ...segment,
                    flipped: !segment.flipped,
                    points: generateParsedPointsWithTimeInSeconds(speed, segment.points.reverse()),
                };
            });
        },
        changeGpxSegmentPoints: (
            state: SegmentDataState,
            action: PayloadAction<{ id: string; newPoints: ParsedPoint[] }>
        ) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, points: action.payload.newPoints } : segment
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
        setSegmentSpeeds: (
            state: SegmentDataState,
            action: PayloadAction<{ id: string; speed?: number; averageSpeed: number }>
        ) => {
            const { id, speed, averageSpeed } = action.payload;
            if (!state.segmentSpeeds) {
                state.segmentSpeeds = { [id]: speed };
            } else {
                state.segmentSpeeds[id] = speed;
            }
            state.segments = state.segments.map((segment) => {
                const adjustedPoints = generateParsedPointsWithTimeInSeconds(speed ?? averageSpeed, segment.points);
                return segment.id === id ? { ...segment, points: adjustedPoints } : segment;
            });
        },
        adjustTimesOfAllSegments: (state: SegmentDataState, action: PayloadAction<number>) => {
            const averageSpeed = action.payload;

            state.segments = state.segments.map((segment) => {
                const segmentSpeed = state.segmentSpeeds[segment.id] ?? averageSpeed;
                const adjustedPoints = generateParsedPointsWithTimeInSeconds(segmentSpeed, segment.points);
                return { ...segment, points: adjustedPoints };
            });
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
        clear: () => initialState,
    },
});

const defaultSegmentSpeeds: Record<string, number | undefined> = {};
export const segmentDataActions = segmentDataSlice.actions;
export const segmentDataReducer: Reducer<SegmentDataState> = segmentDataSlice.reducer;
const getBase = (state: State) => state.segmentData;

export const getParsedGpxSegments = (state: State) => getBase(state).segments;
export const getStreetLookup = (state: State) => getBase(state).streetLookup;
export const getPostCodeLookup = (state: State) => getBase(state).postCodeLookup;
export const getDistrictLookup = (state: State) => getBase(state).districtLookup;

// Older functions TODO: #223 tidy up
export const getConstructionSegments = (state: State) => getBase(state).constructionSegments;
export const getSegmentFilterTerm = (state: State) => getBase(state).segmentFilterTerm;
export const getReplaceProcess = (state: State) => getBase(state).replaceProcess;
export const getSegmentSpeeds = (state: State) => getBase(state).segmentSpeeds ?? defaultSegmentSpeeds;
export const getClickOnSegment = (state: State) => getBase(state).clickOnSegment;

export const getFilteredGpxSegments = createSelector(
    getParsedGpxSegments,
    getSegmentFilterTerm,
    (segments, filterTerm) => {
        return filterItems(filterTerm, segments, (track: ParsedGpxSegment) => track.filename);
    }
);
