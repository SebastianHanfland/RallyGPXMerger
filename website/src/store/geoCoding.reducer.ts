import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { State, GeoCodingState } from './types';
import { storage } from './storage.ts';

const initialState: GeoCodingState = {
    resolvedPositions: {},
};

const geoCodingSlice = createSlice({
    name: 'geoCoding',
    initialState: storage.load()?.geoCoding ?? initialState,
    reducers: {
        setLocationIqKey: (state: GeoCodingState, action: PayloadAction<string>) => {
            state.locationIqKey = action.payload;
        },
        setGeoApifyKey: (state: GeoCodingState, action: PayloadAction<string>) => {
            state.geoApifyKey = action.payload;
        },
        setPositionStackKey: (state: GeoCodingState, action: PayloadAction<string>) => {
            state.positionStackKey = action.payload;
        },
        addResolvedPosition: (state: GeoCodingState, action: PayloadAction<{ identifier: string; street: string }>) => {
            state.resolvedPositions[action.payload.identifier] = action.payload.street;
        },
    },
});

export const geoCodingActions = geoCodingSlice.actions;
export const geoCodingReducer: Reducer<GeoCodingState> = geoCodingSlice.reducer;
const getBase = (state: State) => state.geoCoding;
export const getLocationIqKey = (state: State) => getBase(state).locationIqKey;
export const getGeoApifyKey = (state: State) => getBase(state).geoApifyKey;
export const getPositionStackKey = (state: State) => getBase(state).positionStackKey;
export const getResolvedPositions = (state: State) => getBase(state).resolvedPositions;
