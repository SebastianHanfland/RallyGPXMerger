import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { filterItems } from '../../utils/filterUtil.ts';
import { ClickOnSegment, ParsedGpxSegment, ParsedPoint, SegmentDataState, State } from './types.ts';
import { storage } from './storage.ts';
import { generateParsedPointsForSegmentSpeed } from '../../common/calculation/speed/generateParsedPointsForSegmentSpeed.ts';

const initialState: SegmentDataState = {
    segments: [],
    constructionSegments: [],
    segmentSpeeds: {},
    forcedSegmentSpeeds: {},
    streetLookup: {},
    postCodeLookup: {},
    districtLookup: {},
    replaceStreetLookup: {},
    replacePostCodeLookup: {},
    replaceDistrictLookup: {},
    streetLookupIndex: 0,
};

function getHighestStreetLookupIndex(state: SegmentDataState): number {
    const resolvedIndexes = Object.keys(state.streetLookup).map(Number).filter(Number.isFinite);
    return Math.max(state.streetLookupIndex ?? 0, ...resolvedIndexes, 0);
}

function resolveSegmentTiming(
    state: SegmentDataState,
    segmentId: string,
    averageSpeed: number
): { speed: number; forced: boolean } {
    const customSpeed = state.segmentSpeeds?.[segmentId];
    return {
        speed: customSpeed ?? averageSpeed,
        forced: (customSpeed ?? 0) > 0 && !!state.forcedSegmentSpeeds?.[segmentId],
    };
}

const segmentDataSlice = createSlice({
    name: 'segmentData',
    initialState: storage.load()?.segmentData ?? initialState,
    reducers: {
        addGpxSegments: (state: SegmentDataState, action: PayloadAction<ParsedGpxSegment[]>) => {
            const usedSegmentIds = state.segments.map((segment) => segment.id);
            const alreadyInUse = action.payload.filter((segment) => usedSegmentIds.includes(segment.id));
            const newSegments = action.payload.filter((segment) => !usedSegmentIds.includes(segment.id));

            state.segments = [
                ...state.segments.map(
                    (segment) => alreadyInUse.find((alreadySegment) => alreadySegment.id === segment.id) ?? segment
                ),
                ...newSegments,
            ];
        },
        addStreetLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string | undefined>>) => {
            state.streetLookup = { ...state.streetLookup, ...action.payload };
        },
        addPostCodeLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string>>) => {
            state.postCodeLookup = { ...state.postCodeLookup, ...action.payload };
        },
        addDistrictLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string>>) => {
            state.districtLookup = { ...state.districtLookup, ...action.payload };
        },
        reserveStreetLookupIndexes: (state: SegmentDataState, action: PayloadAction<number>) => {
            state.streetLookupIndex = getHighestStreetLookupIndex(state) + action.payload;
        },
        addReplaceStreetLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string>>) => {
            state.replaceStreetLookup = { ...state.replaceStreetLookup, ...action.payload };
        },
        addReplacePostCodeLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string>>) => {
            state.replacePostCodeLookup = { ...state.replacePostCodeLookup, ...action.payload };
        },
        addReplaceDistrictLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string>>) => {
            state.replaceDistrictLookup = { ...state.replaceDistrictLookup, ...action.payload };
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
                const { speed, forced } = resolveSegmentTiming(state, segment.id, action.payload.averageSpeed);
                return {
                    ...segment,
                    flipped: !segment.flipped,
                    points: generateParsedPointsForSegmentSpeed(speed, segment.points.reverse(), forced),
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
        setSegmentColor: (state: SegmentDataState, action: PayloadAction<{ id: string; color: string }>) => {
            state.segments = state.segments.map((segment) =>
                segment.id === action.payload.id ? { ...segment, color: action.payload.color } : segment
            );
        },
        setFilterTerm: (state: SegmentDataState, action: PayloadAction<string | undefined>) => {
            state.segmentFilterTerm = action.payload;
        },
        setSegmentSpeeds: (
            state: SegmentDataState,
            action: PayloadAction<{ id: string; speed?: number; averageSpeed: number; forced?: boolean }>
        ) => {
            const { id, speed, averageSpeed, forced } = action.payload;
            const appliedForced = !!forced && (speed ?? 0) > 0;
            if (!state.segmentSpeeds) {
                state.segmentSpeeds = { [id]: speed };
            } else {
                state.segmentSpeeds[id] = speed;
            }
            if (!state.forcedSegmentSpeeds) {
                state.forcedSegmentSpeeds = { [id]: appliedForced };
            } else {
                state.forcedSegmentSpeeds[id] = appliedForced;
            }
            state.segments = state.segments.map((segment) => {
                const adjustedPoints = generateParsedPointsForSegmentSpeed(
                    speed ?? averageSpeed,
                    segment.points,
                    appliedForced
                );
                return segment.id === id ? { ...segment, points: adjustedPoints } : segment;
            });
        },
        adjustTimesOfAllSegments: (state: SegmentDataState, action: PayloadAction<number>) => {
            const averageSpeed = action.payload;

            state.segments = state.segments.map((segment) => {
                const { speed, forced } = resolveSegmentTiming(state, segment.id, averageSpeed);
                const adjustedPoints = generateParsedPointsForSegmentSpeed(speed, segment.points, forced);
                return { ...segment, points: adjustedPoints };
            });
        },
        addConstructionSegments: (state: SegmentDataState, action: PayloadAction<ParsedGpxSegment[]>) => {
            state.constructionSegments = [...(state.constructionSegments ?? []), ...action.payload];
        },
        removeConstructionSegment: (state: SegmentDataState, action: PayloadAction<string>) => {
            state.constructionSegments = state.constructionSegments?.filter((segment) => segment.id !== action.payload);
        },
        setClickOnSegment: (state: SegmentDataState, action: PayloadAction<ClickOnSegment | undefined>) => {
            state.clickOnSegment = action.payload;
        },
        clear: () => initialState,
    },
});

const defaultSegmentSpeeds: Record<string, number | undefined> = {};
const defaultForcedSegmentSpeeds: Record<string, boolean | undefined> = {};
export const segmentDataActions = segmentDataSlice.actions;
export const segmentDataReducer: Reducer<SegmentDataState> = segmentDataSlice.reducer;
const getBase = (state: State) => state.segmentData;

export const getParsedGpxSegments = (state: State) => getBase(state).segments;
export const getStreetLookup = (state: State) => getBase(state).streetLookup;
export const getNextStreetLookupIndex = (state: State) => getHighestStreetLookupIndex(getBase(state));
export const getPostCodeLookup = (state: State) => getBase(state).postCodeLookup;
export const getDistrictLookup = (state: State) => getBase(state).districtLookup;
export const getReplaceStreetLookup = (state: State) => getBase(state).replaceStreetLookup;
export const getReplacePostCodeLookup = (state: State) => getBase(state).replacePostCodeLookup;
export const getReplaceDistrictLookup = (state: State) => getBase(state).replaceDistrictLookup;

export const getConstructionSegments = (state: State) => getBase(state).constructionSegments;
export const getSegmentFilterTerm = (state: State) => getBase(state).segmentFilterTerm;
export const getReplaceProcess = (state: State) => getBase(state).replaceProcess;
export const getSegmentSpeeds = (state: State) => getBase(state).segmentSpeeds ?? defaultSegmentSpeeds;
export const getForcedSegmentSpeeds = (state: State) =>
    getBase(state).forcedSegmentSpeeds ?? defaultForcedSegmentSpeeds;
export const getClickOnSegment = (state: State) => getBase(state).clickOnSegment;

export const getFilteredGpxSegments = createSelector(
    getParsedGpxSegments,
    getSegmentFilterTerm,
    (segments, filterTerm) => {
        return filterItems(filterTerm, segments, (track: ParsedGpxSegment) => track.filename);
    }
);
