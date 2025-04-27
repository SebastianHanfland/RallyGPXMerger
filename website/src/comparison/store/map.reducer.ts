import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { ComparisonTrackState, MapState } from './types';

const initialState: MapState = {
    currentTime: 0,
    startAndEndTimes: {},
    isLive: window.location.search.includes('&live'),
};

const mapSlice = createSlice({
    name: 'map',
    initialState: initialState,
    reducers: {
        setCurrentTime: (state: MapState, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setStartAndEndTime: (
            state: MapState,
            action: PayloadAction<{ start: string; end: string; planningId: string }>
        ) => {
            const { start, end, planningId } = action.payload;
            state.startAndEndTimes[planningId] = { start, end };
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
    },
});

export const mapActions = mapSlice.actions;
export const mapReducer: Reducer<MapState> = mapSlice.reducer;
const getBase = (state: ComparisonTrackState) => state.map;
export const getCurrenMapTime = (state: ComparisonTrackState) => getBase(state).currentTime;
export const getStartComparisonMapTime = (state: ComparisonTrackState) => getBase(state).start;
export const getEndComparisonMapTime = (state: ComparisonTrackState) => getBase(state).end;
export const getShowMapMarker = (state: ComparisonTrackState) => getBase(state).showMapMarker ?? false;
export const getHighlightedTrack = (state: ComparisonTrackState) => getBase(state).highlightedTrack;
