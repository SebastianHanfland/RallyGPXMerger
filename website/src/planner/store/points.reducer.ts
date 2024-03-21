import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { PointOfInterest, PointsState, State } from './types.ts';
import { storage } from './storage.ts';

const initialState: PointsState = {
    points: [],
};

const pointSlice = createSlice({
    name: 'points',
    initialState: storage.load()?.points ?? initialState,
    reducers: {
        addPoint: (state: PointsState, action: PayloadAction<PointOfInterest>) => {
            state.points = [...state.points, action.payload];
        },
        updatePoint: (state: PointsState, action: PayloadAction<PointOfInterest>) => {
            const updatedPoint = action.payload;
            state.points = state.points.map((point) => (point.id !== updatedPoint.id ? point : updatedPoint));
        },
        removePoint: (state: PointsState, action: PayloadAction<string>) => {
            state.points = state.points.filter(({ id }) => id !== action.payload);
        },
        setContextMenuPoint: (state: PointsState, action: PayloadAction<{ lat: number; lng: number } | undefined>) => {
            state.contextMenuPoint = action.payload;
        },
        setEditPointOfInterest: (state: PointsState, action: PayloadAction<PointOfInterest | undefined>) => {
            state.editPointOfInterest = action.payload;
        },
    },
});

export const pointsActions = pointSlice.actions;
export const pointsReducer: Reducer<PointsState> = pointSlice.reducer;
const getBase = (state: State) => state.points;
export const getPoints = (state: State) => getBase(state).points;
export const getContextMenuPoint = (state: State) => getBase(state).contextMenuPoint;
export const getEditPointOfInterest = (state: State) => getBase(state).editPointOfInterest;
