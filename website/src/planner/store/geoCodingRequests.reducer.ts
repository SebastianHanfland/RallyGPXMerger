import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { GeoCodingRequestsState, State } from './types.ts';

const initialState: GeoCodingRequestsState = {
    isAggregating: false,
    isLoadingStreetData: false,
    isLoadingPostCodeData: false,
};

const geoCodingRequestsSlice = createSlice({
    name: 'geoCoding',
    initialState: initialState,
    reducers: {
        setIsLoadingStreetData: (state: GeoCodingRequestsState, action: PayloadAction<boolean>) => {
            state.isLoadingStreetData = action.payload;
        },
        setIsLoadingPostCodeData: (state: GeoCodingRequestsState, action: PayloadAction<boolean>) => {
            state.isLoadingPostCodeData = action.payload;
        },
        setIsAggregating: (state: GeoCodingRequestsState, action: PayloadAction<boolean>) => {
            state.isAggregating = action.payload;
        },
        clear: () => initialState,
    },
});

export const geoCodingRequestsActions = geoCodingRequestsSlice.actions;
export const geoCodingRequestsReducer: Reducer<GeoCodingRequestsState> = geoCodingRequestsSlice.reducer;
const getBase = (state: State) => state.geoCodingRequests;
export const getIsLoadingGeoData = (state: State) =>
    getIsLoadingStreetData(state) || getIsLoadingPostCodeData(state) || getIsAggregating(state);
export const getIsAggregating = (state: State) => getBase(state).isAggregating;
export const getIsLoadingStreetData = (state: State) => getBase(state).isLoadingStreetData;
export const getIsLoadingPostCodeData = (state: State) => getBase(state).isLoadingPostCodeData;
