import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { MapState, State } from './types.ts';
import { storage } from './storage.ts';

const initialState: MapState = {
    currentTime: 0,
};

const mapSlice = createSlice({
    name: 'map',
    initialState: storage.load()?.map ?? initialState,
    reducers: {
        setCurrentTime: (state: MapState, action: PayloadAction<number>) => {
            state.currentTime = action.payload;
        },
        setShowMapMarker: (state: MapState, action: PayloadAction<boolean>) => {
            state.showMapMarker = action.payload;
        },
        setShowBreakMarker: (state: MapState, action: PayloadAction<boolean>) => {
            state.showBreakMarker = action.payload;
        },
        setShowBlockStreets: (state: MapState, action: PayloadAction<boolean>) => {
            state.showBlockStreets = action.payload;
        },
        setShowCalculatedTracks: (state: MapState, action: PayloadAction<boolean>) => {
            state.showCalculatedTracks = action.payload;
        },
        setShowGpxSegments: (state: MapState, action: PayloadAction<boolean>) => {
            state.showGpxSegments = action.payload;
        },
        setShowConstructions: (state: MapState, action: PayloadAction<boolean>) => {
            state.showConstructions = action.payload;
        },
        setShowPointsOfInterest: (state: MapState, action: PayloadAction<boolean>) => {
            state.showPointsOfInterest = action.payload;
        },
        setHighlightedSegmentId: (state: MapState, action: PayloadAction<string | undefined>) => {
            state.highlightedSegmentId = action.payload;
        },
        setPointToCenter: (state: MapState, action: PayloadAction<{ lat: number; lng: number } | undefined>) => {
            const point = action.payload;
            if (point) {
                state.pointToCenter = { lat: point.lat, lng: point.lng + 0.01, zoom: 15 };
            } else {
                state.pointToCenter = undefined;
            }
        },
    },
});

export const mapActions = mapSlice.actions;
export const mapReducer: Reducer<MapState> = mapSlice.reducer;
const getBase = (state: State) => state.map;
export const getCurrenMapTime = (state: State) => getBase(state).currentTime;
export const getShowMapMarker = (state: State) => getBase(state).showMapMarker;
export const getShowBreakMarker = (state: State) => getBase(state).showBreakMarker;
export const getShowBlockStreets = (state: State) => getBase(state).showBlockStreets;
export const getShowCalculatedTracks = (state: State) => getBase(state).showCalculatedTracks;
export const getShowGpxSegments = (state: State) => getBase(state).showGpxSegments;
export const getShowConstructions = (state: State) => getBase(state).showConstructions;
export const getShowPointsOfInterest = (state: State) => getBase(state).showPointsOfInterest ?? true;
export const getHighlightedSegmentId = (state: State) => getBase(state).highlightedSegmentId;
export const getPointToCenter = (state: State) => getBase(state).pointToCenter;
