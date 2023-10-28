import { createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { State, TrackMergeState } from './types';
import { storage } from './storage.ts';
import { v4 as uuidv4 } from 'uuid';
import { DELAY_PER_PERSON_IN_SECONDS } from '../logic/withPeoples/peopleDelayCounter.ts';

export let PARTICIPANTS_DELAY_IN_SECONDS = DELAY_PER_PERSON_IN_SECONDS;

export const setParticipantsDelay = (delay: number) => {
    PARTICIPANTS_DELAY_IN_SECONDS = delay;
};

const initialState: TrackMergeState = {
    trackCompositions: [],
    participantDelay: DELAY_PER_PERSON_IN_SECONDS,
};

const trackMergeSlice = createSlice({
    name: 'trackMerge',
    initialState: storage.load()?.trackMerge ?? initialState,
    reducers: {
        addTrackComposition: (state: TrackMergeState) => {
            state.trackCompositions = [...state.trackCompositions, { id: uuidv4(), segmentIds: [] }];
        },
        removeTrackComposition: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.trackCompositions = state.trackCompositions.filter((track) => track.id !== action.payload);
        },
        setSegments: (state: TrackMergeState, action: PayloadAction<{ id: string; segments: string[] }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, segmentIds: action.payload.segments } : track
            );
        },
        setTrackName: (state: TrackMergeState, action: PayloadAction<{ id: string; trackName: string }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, name: action.payload.trackName } : track
            );
        },
        removeGpxSegment: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.trackCompositions = state.trackCompositions.map((track) => ({
                ...track,
                segmentIds: track.segmentIds.filter((segmentId) => segmentId !== action.payload),
            }));
        },
        setArrivalDateTime: (state: TrackMergeState, action: PayloadAction<string | undefined>) => {
            state.arrivalDateTime = action.payload;
        },
        setParticipantsDelays: (state: TrackMergeState, action: PayloadAction<number>) => {
            state.participantDelay = action.payload;
        },
        clear: (state: TrackMergeState) => {
            state.trackCompositions = [];
            state.arrivalDateTime = undefined;
        },
    },
});

export const trackMergeActions = trackMergeSlice.actions;
export const trackMergeReducer: Reducer<TrackMergeState> = trackMergeSlice.reducer;
const getBase = (state: State) => state.trackMerge;
export const getTrackCompositions = (state: State) => getBase(state).trackCompositions;
export const getArrivalDateTime = (state: State) => getBase(state).arrivalDateTime;
export const getParticipantsDelay = (state: State) => getBase(state).participantDelay;
