import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { GeoCodingRequestsState, State } from './types.ts';

const initialState: GeoCodingRequestsState = {
    requestCounter: 0,
    postCodeRequestCounter: 0,
    requestDoneCounter: 0,
    postCodeRequestDoneCounter: 0,
    isLoadingData: false,
};

const geoCodingRequestsSlice = createSlice({
    name: 'geoCoding',
    initialState: initialState,
    reducers: {
        increaseActiveRequestCounter: (state: GeoCodingRequestsState) => {
            state.requestCounter += 1;
        },
        decreaseActiveRequestCounter: (state: GeoCodingRequestsState) => {
            state.requestCounter -= 1;
        },
        increaseRequestDoneCounter: (state: GeoCodingRequestsState) => {
            state.requestDoneCounter += 1;
        },
        resetRequestDoneCounter: (state: GeoCodingRequestsState) => {
            state.requestDoneCounter = 0;
        },
        setNumberOfRequiredRequests: (state: GeoCodingRequestsState, action: PayloadAction<number>) => {
            state.numberOfRequiredRequests = action.payload;
        },
        increaseActivePostCodeRequestCounter: (state: GeoCodingRequestsState) => {
            state.postCodeRequestCounter += 1;
        },
        decreaseActivePostCodeRequestCounter: (state: GeoCodingRequestsState) => {
            state.postCodeRequestCounter -= 1;
        },
        increasePostCodeRequestDoneCounter: (state: GeoCodingRequestsState) => {
            state.postCodeRequestDoneCounter += 1;
        },
        resetPostCodeRequestDoneCounter: (state: GeoCodingRequestsState) => {
            state.postCodeRequestDoneCounter = 0;
        },
        setIsLoadingData: (state: GeoCodingRequestsState, action: PayloadAction<boolean>) => {
            state.isLoadingData = action.payload;
        },
    },
});

export const geoCodingRequestsActions = geoCodingRequestsSlice.actions;
export const geoCodingRequestsReducer: Reducer<GeoCodingRequestsState> = geoCodingRequestsSlice.reducer;
const getBase = (state: State) => state.geoCodingRequests;
export const getNumberOfRequiredRequests = (state: State) => getBase(state).numberOfRequiredRequests;
export const getNumberOfRequestsDone = (state: State) => getBase(state).requestDoneCounter;
export const getNumberOfPostCodeRequestsDone = (state: State) => getBase(state).postCodeRequestDoneCounter;
export const getNumberOfRequestsRunning = (state: State) => getBase(state).requestCounter;
export const getNumberOfPostCodeRequestsRunning = (state: State) => getBase(state).postCodeRequestCounter;
export const getIsLoadingGeoData = (state: State) => getBase(state).isLoadingData;
