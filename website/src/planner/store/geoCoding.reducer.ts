import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { GeoCodingState, State } from './types.ts';
import { storage } from './storage.ts';
import {
    DistrictReplacementWayPoint,
    ReplacementWayPoint,
    StreetNameReplacementWayPoint,
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
export const getStreetNameReplacementWayPoints = (state: State) => getBase(state).streetReplacementWayPoints;
export const getDistrictReplacementWayPoints = (state: State) => getBase(state).districtReplacementWayPoints;
export const getOnlyShowUnknown = (state: State) => getBase(state).onlyShowUnknown ?? false;
