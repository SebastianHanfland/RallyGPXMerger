import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { MapState, State } from './types.ts';
import { storage } from './storage.ts';
import { VersionsState } from '../../versions/store/types';

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
        setStartAndEndTime: (state: MapState, action: PayloadAction<{ start: string; end: string }>) => {
            state.start = action.payload.start;
            state.end = action.payload.end;
        },
        setCenterPoint: (state: MapState, action: PayloadAction<{ lat: number; lng: number; zoom: number }>) => {
            state.centerPoint = action.payload;
        },
        setShowMapMarker: (state: MapState, action: PayloadAction<boolean>) => {
            state.showMapMarker = action.payload;
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
    },
});

export const mapActions = mapSlice.actions;
export const mapReducer: Reducer<MapState> = mapSlice.reducer;
const getBase = (state: State | VersionsState) => state.map;
export const getCurrenMapTime = (state: State | VersionsState) => getBase(state).currentTime;
export const getStartMapTime = (state: State | VersionsState) => getBase(state).start ?? '2023-04-23T07:00:00.000Z';
export const getEndMapTime = (state: State | VersionsState) => getBase(state).end ?? '2023-04-23T16:00:00.000Z';
export const getCenterPoint = (state: State | VersionsState) => getBase(state).centerPoint;
export const getShowMapMarker = (state: State | VersionsState) => getBase(state).showMapMarker ?? false;
export const getShowBlockStreets = (state: State | VersionsState) => getBase(state).showBlockStreets ?? false;
export const getShowCalculatedTracks = (state: State | VersionsState) => getBase(state).showCalculatedTracks ?? false;
export const getShowGpxSegments = (state: State | VersionsState) => getBase(state).showGpxSegments ?? false;
export const getShowConstructions = (state: State | VersionsState) => getBase(state).showConstructions ?? false;
