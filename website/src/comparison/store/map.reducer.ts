import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { ComparisonState, MapState } from './types';

const initialState: MapState = {
    currentTime: 0,
    isLive: window.location.search.includes('&live'),
};

const mapSlice = createSlice({
    name: 'map',
    initialState: initialState,
    reducers: {
        setCurrentTime: (state: MapState, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setCurrentRealTime: (state: MapState) => {
            state.currentRealTime = new Date().toISOString();
        },
        setStartAndEndTime: (state: MapState, action: PayloadAction<{ start: string; end: string }>) => {
            state.start = action.payload.start;
            state.end = action.payload.end;
        },
        setShowMapMarker: (state: MapState, action: PayloadAction<boolean>) => {
            state.showMapMarker = action.payload;
        },
        setShowTrackInfo: (state: MapState, action: PayloadAction<boolean>) => {
            state.showTrackInfo = action.payload;
        },
        setShowSingleTrackInfo: (state: MapState, action: PayloadAction<string | undefined>) => {
            state.showSingleTrackInfo = action.payload;
        },
        setHighlightedTrack: (state: MapState, action: PayloadAction<string | undefined>) => {
            state.highlightedTrack = action.payload;
        },
        setIsLive: (state: MapState, action: PayloadAction<boolean>) => {
            state.isLive = action.payload;
        },
    },
});

export const mapActions = mapSlice.actions;
export const mapReducer: Reducer<MapState> = mapSlice.reducer;
const getBase = (state: ComparisonState) => state.map;
export const getCurrenMapTime = (state: ComparisonState) => getBase(state).currentTime;
export const getCurrentRealTime = (state: ComparisonState) => getBase(state).currentRealTime;
export const getStartMapTime = (state: ComparisonState) => getBase(state).start;
export const getEndMapTime = (state: ComparisonState) => getBase(state).end;
export const getShowMapMarker = (state: ComparisonState) => getBase(state).showMapMarker ?? false;
export const getHighlightedTrack = (state: ComparisonState) => getBase(state).highlightedTrack;
export const getIsLive = (state: ComparisonState) => getBase(state).isLive;
