import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { PointOfInterest, PointOfInterestType, PointsState, State } from './types.ts';
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
        addGapPoint: (state: PointsState, action: PayloadAction<PointOfInterest>) => {
            const newGap = action.payload;
            const gapAlreadyAtLocation = state.points.find(
                (point) =>
                    point.lat === newGap.lat && point.lng === newGap.lng && point.type === PointOfInterestType.GAP
            );
            console.log(newGap, gapAlreadyAtLocation, 'GAP');
            if (!gapAlreadyAtLocation) {
                state.points = [...state.points, newGap];
            } else {
                const updatedPoint = gapAlreadyAtLocation.description.includes(newGap.description)
                    ? gapAlreadyAtLocation
                    : {
                          ...gapAlreadyAtLocation,
                          description: gapAlreadyAtLocation.description + '\n' + newGap.description,
                      };
                state.points = state.points.map((point) =>
                    point.lat === newGap.lat && point.lng === newGap.lng ? updatedPoint : point
                );
            }
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
        clear: () => initialState,
    },
});

export const pointsActions = pointSlice.actions;
export const pointsReducer: Reducer<PointsState> = pointSlice.reducer;
const getBase = (state: State) => state.points;
export const getPoints = (state: State) => getBase(state).points;
export const getContextMenuPoint = (state: State) => getBase(state).contextMenuPoint;
export const getEditPointOfInterest = (state: State) => getBase(state).editPointOfInterest;
