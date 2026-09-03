import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { filterItems } from '../../utils/filterUtil.ts';
import {
    ClickOnSegment,
    ManualLookupField,
    ParsedGpxSegment,
    ParsedPoint,
    SegmentDataState,
    SegmentSortDirection,
    SegmentSortField,
    State,
} from './types.ts';
import { storage } from './storage.ts';
import { generateParsedPointsWithTimeInSeconds } from '../../common/calculation/speed/speedSimulatorTimeInSeconds.ts';
import { getStreetLookupIndex } from '../logic/resolving/helper/getStreetLookupIndex.ts';
import type { StreetPointAssignment } from '../logic/resolving/streets/streetRangeEditing.ts';

const initialState: SegmentDataState = {
    segments: [],
    constructionSegments: [],
    segmentSpeeds: {},
    fixedSegmentSpeeds: {},
    streetLookup: {},
    postCodeLookup: {},
    districtLookup: {},
    streetLookupIndex: 0,
    segmentSortField: 'name',
    segmentSortDirection: 'ascending',
    showUsedSegments: true,
    showUnusedSegments: true,
};

function getHighestStreetLookupIndex(state: SegmentDataState): number {
    const lookupIndexes = [state.streetLookup, state.postCodeLookup, state.districtLookup]
        .flatMap((lookup) => Object.keys(lookup))
        .map(Number)
        .filter(Number.isFinite);
    const manualIndexes = state.segments.flatMap((segment) =>
        segment.points.flatMap((point) => [point.s, point.m]).filter((index): index is number => index !== undefined)
    );
    return Math.max(state.streetLookupIndex ?? 0, ...lookupIndexes, ...manualIndexes, 0);
}

function keepLookupIndexes(
    lookup: Record<number, string | undefined>,
    indexesToKeep: Set<number>
): Record<number, string | undefined> {
    return Object.fromEntries(Object.entries(lookup).filter(([index]) => indexesToKeep.has(Number(index)))) as Record<
        number,
        string | undefined
    >;
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
        addPostCodeLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string | undefined>>) => {
            state.postCodeLookup = { ...state.postCodeLookup, ...action.payload };
        },
        addDistrictLookup: (state: SegmentDataState, action: PayloadAction<Record<number, string | undefined>>) => {
            state.districtLookup = { ...state.districtLookup, ...action.payload };
        },
        reserveStreetLookupIndexes: (state: SegmentDataState, action: PayloadAction<number>) => {
            state.streetLookupIndex = getHighestStreetLookupIndex(state) + action.payload;
        },
        applyManualLookup: (
            state: SegmentDataState,
            action: PayloadAction<{ sourceIndex: number; field: ManualLookupField; value: string }>
        ) => {
            const { sourceIndex, field, value } = action.payload;
            const pointsToUpdate = state.segments.flatMap((segment) =>
                segment.points.filter((point) => getStreetLookupIndex(point) === sourceIndex)
            );
            if (pointsToUpdate.length === 0) {
                return;
            }

            const manualIndex = getHighestStreetLookupIndex(state) + 1;
            state.streetLookup[manualIndex] = state.streetLookup[sourceIndex];
            state.postCodeLookup[manualIndex] = state.postCodeLookup[sourceIndex];
            state.districtLookup[manualIndex] = state.districtLookup[sourceIndex];

            if (field === 'street') {
                state.streetLookup[manualIndex] = value;
            } else if (field === 'postCode') {
                state.postCodeLookup[manualIndex] = value;
            } else {
                state.districtLookup[manualIndex] = value;
            }

            state.segments = state.segments.map((segment) => ({
                ...segment,
                points: segment.points.map((point) =>
                    getStreetLookupIndex(point) === sourceIndex ? { ...point, m: manualIndex } : point
                ),
            }));
            state.streetLookupIndex = manualIndex;
        },
        applyStreetRangeAssignments: (state: SegmentDataState, action: PayloadAction<StreetPointAssignment[]>) => {
            const unknownIndexes = new Map<StreetPointAssignment['lookupIndex'], number>();
            const getAssignmentIndex = (lookupIndex: StreetPointAssignment['lookupIndex']): number => {
                if (typeof lookupIndex === 'number') {
                    return lookupIndex;
                }
                const existingIndex = unknownIndexes.get(lookupIndex);
                if (existingIndex !== undefined) {
                    return existingIndex;
                }
                const newIndex = getHighestStreetLookupIndex(state) + 1;
                unknownIndexes.set(lookupIndex, newIndex);
                state.streetLookup[newIndex] = undefined;
                state.postCodeLookup[newIndex] = undefined;
                state.districtLookup[newIndex] = undefined;
                state.streetLookupIndex = newIndex;
                return newIndex;
            };

            const assignmentsBySegment = new Map<string, Map<number, number>>();
            action.payload.forEach((assignment) => {
                let segmentAssignments = assignmentsBySegment.get(assignment.segmentId);
                if (!segmentAssignments) {
                    segmentAssignments = new Map<number, number>();
                    assignmentsBySegment.set(assignment.segmentId, segmentAssignments);
                }
                segmentAssignments.set(assignment.pointIndex, getAssignmentIndex(assignment.lookupIndex));
            });

            state.segments = state.segments.map((segment) => {
                const segmentAssignments = assignmentsBySegment.get(segment.id);
                if (!segmentAssignments) {
                    return segment;
                }
                return {
                    ...segment,
                    points: segment.points.map((point, pointIndex) => {
                        const lookupIndex = segmentAssignments.get(pointIndex);
                        return lookupIndex === undefined ? point : { ...point, m: lookupIndex };
                    }),
                };
            });
        },
        clearResolvedStreetData: (state: SegmentDataState) => {
            const manualIndexes = new Set(
                state.segments.flatMap((segment) =>
                    segment.points.map((point) => point.m).filter((index): index is number => index !== undefined)
                )
            );
            state.streetLookup = keepLookupIndexes(state.streetLookup, manualIndexes);
            state.postCodeLookup = keepLookupIndexes(state.postCodeLookup, manualIndexes);
            state.districtLookup = keepLookupIndexes(state.districtLookup, manualIndexes);
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
                const fixedVelocity = state.fixedSegmentSpeeds?.[segment.id] ?? false;
                return {
                    ...segment,
                    flipped: !segment.flipped,
                    points: generateParsedPointsWithTimeInSeconds(speed, segment.points.reverse(), fixedVelocity),
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
            action: PayloadAction<{ id: string; speed?: number; averageSpeed: number; fixedVelocity?: boolean }>
        ) => {
            const { id, speed, averageSpeed, fixedVelocity = false } = action.payload;
            if (!state.segmentSpeeds) {
                state.segmentSpeeds = { [id]: speed };
            } else {
                state.segmentSpeeds[id] = speed;
            }
            state.fixedSegmentSpeeds = { ...(state.fixedSegmentSpeeds ?? {}), [id]: fixedVelocity };
            state.segments = state.segments.map((segment) => {
                const adjustedPoints = generateParsedPointsWithTimeInSeconds(
                    speed ?? averageSpeed,
                    segment.points,
                    fixedVelocity
                );
                return segment.id === id ? { ...segment, points: adjustedPoints } : segment;
            });
        },
        adjustTimesOfAllSegments: (state: SegmentDataState, action: PayloadAction<number>) => {
            const averageSpeed = action.payload;

            state.segments = state.segments.map((segment) => {
                const segmentSpeed = state.segmentSpeeds[segment.id] ?? averageSpeed;
                const fixedVelocity = state.fixedSegmentSpeeds?.[segment.id] ?? false;
                const adjustedPoints = generateParsedPointsWithTimeInSeconds(
                    segmentSpeed,
                    segment.points,
                    fixedVelocity
                );
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
        toggleSegmentSort: (state: SegmentDataState, action: PayloadAction<SegmentSortField>) => {
            const sortField = state.segmentSortField ?? 'name';
            if (sortField === action.payload) {
                state.segmentSortDirection = state.segmentSortDirection === 'ascending' ? 'descending' : 'ascending';
            } else {
                state.segmentSortField = action.payload;
                state.segmentSortDirection = 'ascending';
            }
        },
        toggleShowUsedSegments: (state: SegmentDataState) => {
            const showUsedSegments = !(state.showUsedSegments ?? true);
            const showUnusedSegments = state.showUnusedSegments ?? true;
            if (!showUsedSegments && !showUnusedSegments) {
                state.showUsedSegments = true;
                state.showUnusedSegments = true;
            } else {
                state.showUsedSegments = showUsedSegments;
                state.showUnusedSegments = showUnusedSegments;
            }
        },
        toggleShowUnusedSegments: (state: SegmentDataState) => {
            const showUsedSegments = state.showUsedSegments ?? true;
            const showUnusedSegments = !(state.showUnusedSegments ?? true);
            if (!showUsedSegments && !showUnusedSegments) {
                state.showUsedSegments = true;
                state.showUnusedSegments = true;
            } else {
                state.showUsedSegments = showUsedSegments;
                state.showUnusedSegments = showUnusedSegments;
            }
        },
        clear: () => initialState,
    },
});

const defaultSegmentSpeeds: Record<string, number | undefined> = {};
export const segmentDataActions = segmentDataSlice.actions;
export const segmentDataReducer: Reducer<SegmentDataState> = segmentDataSlice.reducer;
const getBase = (state: State) => state.segmentData;

export const getParsedGpxSegments = (state: State) => getBase(state).segments;
export const makeGetParsedGpxSegment = () =>
    createSelector([getParsedGpxSegments, (_state: State, segmentId: string) => segmentId], (segments, segmentId) =>
        segments.find((segment) => segment.id === segmentId)
    );
export const getStreetLookup = (state: State) => getBase(state).streetLookup;
export const getNextStreetLookupIndex = (state: State) => getHighestStreetLookupIndex(getBase(state));
export const getPostCodeLookup = (state: State) => getBase(state).postCodeLookup;
export const getDistrictLookup = (state: State) => getBase(state).districtLookup;

export const getConstructionSegments = (state: State) => getBase(state).constructionSegments;
export const getSegmentFilterTerm = (state: State) => getBase(state).segmentFilterTerm;
export const getSegmentSortField = (state: State): SegmentSortField => getBase(state).segmentSortField ?? 'name';
export const getSegmentSortDirection = (state: State): SegmentSortDirection =>
    getBase(state).segmentSortDirection ?? 'ascending';
export const getShowUsedSegments = (state: State) => getBase(state).showUsedSegments ?? true;
export const getShowUnusedSegments = (state: State) => getBase(state).showUnusedSegments ?? true;
export const getReplaceProcess = (state: State) => getBase(state).replaceProcess;
export const getSegmentSpeeds = (state: State) => getBase(state).segmentSpeeds ?? defaultSegmentSpeeds;
const defaultFixedSegmentSpeeds: Record<string, boolean> = {};
export const getFixedSegmentSpeeds = (state: State) => getBase(state).fixedSegmentSpeeds ?? defaultFixedSegmentSpeeds;
export const getClickOnSegment = (state: State) => getBase(state).clickOnSegment;

export const getFilteredGpxSegments = createSelector(
    getParsedGpxSegments,
    getSegmentFilterTerm,
    (segments, filterTerm) => {
        return filterItems(filterTerm, segments, (track: ParsedGpxSegment) => track.filename);
    }
);
