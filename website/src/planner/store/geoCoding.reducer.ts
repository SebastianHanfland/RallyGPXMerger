import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { GeoCodingState, ResolvedDistricts, ResolvedPositions, ResolvedPostCodes, State } from './types.ts';
import { storage } from './storage.ts';
import { TrackStreetInfo, TrackWayPoint } from '../logic/resolving/types.ts';

const initialState: GeoCodingState = {};

function sameWayPoint(wayPointA: TrackWayPoint, wayPointB: TrackWayPoint) {
    return (
        wayPointA.streetName === wayPointB.streetName &&
        wayPointA.pointTo.lat === wayPointB.pointTo.lat &&
        wayPointA.pointTo.lon === wayPointB.pointTo.lon &&
        wayPointA.pointFrom.lat === wayPointB.pointFrom.lat &&
        wayPointA.pointFrom.lon === wayPointB.pointFrom.lon &&
        wayPointA.backArrival === wayPointB.backArrival
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
        changeTrackStreetInfoName: (
            state: GeoCodingState,
            action: PayloadAction<{ trackInfoId: string; previous: TrackWayPoint; updated: TrackWayPoint }>
        ) => {
            const { previous, updated, trackInfoId } = action.payload;
            state.trackStreetInfos = state.trackStreetInfos?.map((info) => {
                if (info.id === trackInfoId) {
                    return {
                        ...info,
                        wayPoints: info.wayPoints.map((wayPoint) =>
                            sameWayPoint(wayPoint, previous) ? updated : wayPoint
                        ),
                    };
                } else {
                    return info;
                }
            });
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
export const getResolvedPositions = (state: State) => getBase(state).resolvedPositions ?? {};
export const getResolvedPostCodes = (state: State) => getBase(state).resolvedPostCodes ?? {};
export const getResolvedDistricts = (state: State) => getBase(state).resolvedDistricts ?? {};
export const getTrackStreetInfos = (state: State) => getBase(state).trackStreetInfos ?? [];
export const getOnlyShowUnknown = (state: State) => getBase(state).onlyShowUnknown ?? false;
