import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { IFrameState, MapState } from './types';

const initialState: MapState = {
    currentTime: 0,
};

const mapSlice = createSlice({
    name: 'map',
    initialState: initialState,
    reducers: {
        setCurrentTime: (state: MapState, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setStartAndEndTime: (state: MapState, action: PayloadAction<{ start: string; end: string }>) => {
            state.start = action.payload.start;
            state.end = action.payload.end;
        },
        setShowMapMarker: (state: MapState, action: PayloadAction<boolean>) => {
            state.showMapMarker = action.payload;
        },
    },
});

export const mapActions = mapSlice.actions;
export const mapReducer: Reducer<MapState> = mapSlice.reducer;
const getBase = (state: IFrameState) => state.map;
export const getCurrenMapTime = (state: IFrameState) => getBase(state).currentTime;
export const getShowMapMarker = (state: IFrameState) => getBase(state).showMapMarker ?? false;
