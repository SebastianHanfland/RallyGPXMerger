import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { GeoCodingState, ResolvedDistricts, ResolvedPositions, ResolvedPostCodes, State } from './types.ts';
import { storage } from './storage.ts';
import {
    DistrictReplacementWayPoint,
    ReplacementWayPoint,
    StreetNameReplacementWayPoint,
    TrackStreetInfo,
} from '../logic/resolving/types.ts';

const initialState: GeoCodingState = {};

export function sameWayPoint(wayPointA: ReplacementWayPoint, wayPointB: ReplacementWayPoint) {
    return (
        wayPointA.pointTo.lat === wayPointB.pointTo.lat &&
        wayPointA.pointTo.lon === wayPointB.pointTo.lon &&
        wayPointA.pointFrom.lat === wayPointB.pointFrom.lat &&
        wayPointA.pointFrom.lon === wayPointB.pointFrom.lon
    );
}

const geoCodingSlice = createSlice({
    name: 'geoCoding',
    initialState: storage.load()?.geoCoding ?? initialState,
    reducers: {
        setGeoApifyKey: (state: GeoCodingState, action: PayloadAction<string>) => {
            state.geoApifyKey = action.payload;
        },
        setBigDataCloudKey: (state: GeoCodingState, action: PayloadAction<string>) => {
            state.bigDataCloudKey = action.payload;
        },
        saveResolvedPositions: (state: GeoCodingState, action: PayloadAction<ResolvedPositions>) => {
            if (!state.resolvedPositions) {
                state.resolvedPositions = {};
            }
            const resolvedPositions = state.resolvedPositions;
            Object.entries(action.payload).forEach(([key, value]) => {
                if (resolvedPositions[key] === null) {
                    resolvedPositions[key] = value;
                }
                if (resolvedPositions[key] === undefined) {
                    resolvedPositions[key] = value;
                }
            });
            state.resolvedPositions = resolvedPositions;
        },
        saveResolvedPostCodes: (state: GeoCodingState, action: PayloadAction<ResolvedPostCodes>) => {
            if (!state.resolvedPostCodes) {
                state.resolvedPostCodes = {};
            }
            const resolvedPostCodes = state.resolvedPostCodes;
            Object.entries(action.payload).forEach(([key, value]) => {
                if (resolvedPostCodes[key] === undefined || resolvedPostCodes[key] === -1) {
                    resolvedPostCodes[key] = value;
                }
            });
            state.resolvedPostCodes = resolvedPostCodes;
        },
        saveResolvedDistricts: (state: GeoCodingState, action: PayloadAction<ResolvedDistricts>) => {
            if (!state.resolvedDistricts) {
                state.resolvedDistricts = {};
            }
            const resolvedDistricts = state.resolvedDistricts;
            Object.entries(action.payload).forEach(([key, value]) => {
                if (resolvedDistricts[key] === undefined) {
                    resolvedDistricts[key] = value;
                }
            });
            state.resolvedDistricts = resolvedDistricts;
        },
        clearPostCodesAndDistricts: (state: GeoCodingState) => {
            state.resolvedPostCodes = undefined;
            state.resolvedDistricts = undefined;
        },
        clearStreetNames: (state: GeoCodingState) => {
            state.resolvedPositions = undefined;
        },
        setTrackStreetInfos: (state: GeoCodingState, action: PayloadAction<TrackStreetInfo[]>) => {
            state.trackStreetInfos = action.payload;
        },
        setStreetNameReplacementWaypoint: (
            state: GeoCodingState,
            action: PayloadAction<StreetNameReplacementWayPoint>
        ) => {
            const updated = action.payload;
            if (!state.streetReplacementWayPoints?.some((point) => sameWayPoint(point, updated))) {
                state.streetReplacementWayPoints = [...(state.streetReplacementWayPoints ?? []), updated];
            } else {
                state.streetReplacementWayPoints = state.streetReplacementWayPoints?.map((point) =>
                    sameWayPoint(point, updated) ? updated : point
                );
            }
        },
        setDistrictReplacementWaypoint: (state: GeoCodingState, action: PayloadAction<DistrictReplacementWayPoint>) => {
            const updated = action.payload;
            if (!state.districtReplacementWayPoints?.some((point) => sameWayPoint(point, updated))) {
                state.districtReplacementWayPoints = [...(state.districtReplacementWayPoints ?? []), updated];
            } else {
                state.districtReplacementWayPoints = state.districtReplacementWayPoints?.map((point) =>
                    sameWayPoint(point, updated) ? updated : point
                );
            }
        },
        toggleOnlyShowUnknown: (state: GeoCodingState) => {
            state.onlyShowUnknown = !state.onlyShowUnknown;
        },
        clear: () => initialState,
    },
});

export const geoCodingActions = geoCodingSlice.actions;
export const geoCodingReducer: Reducer<GeoCodingState> = geoCodingSlice.reducer;
const getBase = (state: State) => state.geoCoding;
export const getGeoApifyKey = (state: State) => getBase(state).geoApifyKey;
export const getBigDataCloudKey = (state: State) => getBase(state).bigDataCloudKey;
export const getResolvedPositions = (state: State) => getBase(state).resolvedPositions;
export const getResolvedPostCodes = (state: State) => getBase(state).resolvedPostCodes;
export const getStreetNameReplacementWayPoints = (state: State) => getBase(state).streetReplacementWayPoints;
export const getDistrictReplacementWayPoints = (state: State) => getBase(state).districtReplacementWayPoints;
export const getResolvedDistricts = (state: State) => getBase(state).resolvedDistricts;
export const getTrackStreetInfos = (state: State) => getBase(state).trackStreetInfos;
export const getOnlyShowUnknown = (state: State) => getBase(state).onlyShowUnknown ?? false;
