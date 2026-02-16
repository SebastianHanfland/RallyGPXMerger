import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { State, TrackComposition, TrackMergeState } from './types.ts';
import { storage } from './storage.ts';
import { v4 as uuidv4 } from 'uuid';
import { filterItems } from '../../utils/filterUtil.ts';
import { DEFAULT_AVERAGE_SPEED_IN_KM_H, DEFAULT_GAP_TOLERANCE, DELAY_PER_PERSON_IN_SECONDS } from './constants.ts';

const initialState: TrackMergeState = {
    trackCompositions: [],
    participantDelay: DELAY_PER_PERSON_IN_SECONDS,
    gapToleranceInKm: DEFAULT_GAP_TOLERANCE,
};

const trackMergeSlice = createSlice({
    name: 'trackMerge',
    initialState: storage.load()?.trackMerge ?? initialState,
    reducers: {
        addTrackComposition: (state: TrackMergeState, action: PayloadAction<TrackComposition | undefined>) => {
            if (action.payload) {
                state.trackCompositions = [...state.trackCompositions, action.payload];
            } else {
                state.trackCompositions = [...state.trackCompositions, { id: uuidv4(), segmentIds: [], name: '' }];
            }
        },
        removeTrackComposition: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.trackCompositions = state.trackCompositions.filter((track) => track.id !== action.payload);
        },
        setSegments: (state: TrackMergeState, action: PayloadAction<{ id: string; segments: string[] }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, segmentIds: action.payload.segments } : track
            );
        },
        removeSegmentFromTrack: (state: TrackMergeState, action: PayloadAction<{ id: string; segmentId: string }>) => {
            const segmentId = action.payload.segmentId;

            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id
                    ? { ...track, segmentIds: track.segmentIds.filter((sId) => sId !== segmentId) }
                    : track
            );
        },
        setTrackName: (state: TrackMergeState, action: PayloadAction<{ id: string; trackName: string }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, name: action.payload.trackName } : track
            );
            state.filterTerm = undefined;
        },
        setTrackPeopleCount: (
            state: TrackMergeState,
            action: PayloadAction<{ id: string; peopleCount: number | undefined }>
        ) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, peopleCount: action.payload.peopleCount } : track
            );
        },
        setTrackPriority: (
            state: TrackMergeState,
            action: PayloadAction<{ id: string; priority: number | undefined }>
        ) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, priority: action.payload.priority } : track
            );
        },
        setTrackRounding: (
            state: TrackMergeState,
            action: PayloadAction<{ id: string; rounding: number | undefined }>
        ) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, rounding: action.payload.rounding } : track
            );
        },
        setTrackBuffer: (state: TrackMergeState, action: PayloadAction<{ id: string; buffer: number | undefined }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, buffer: action.payload.buffer } : track
            );
        },
        removeGpxSegment: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.trackCompositions = state.trackCompositions.map((track) => ({
                ...track,
                segmentIds: track.segmentIds.filter((segmentId) => segmentId !== action.payload),
            }));
        },
        setArrivalDateTime: (state: TrackMergeState, action: PayloadAction<string | undefined>) => {
            state.hasDefaultArrivalDate = false;
            state.arrivalDateTime = action.payload;
        },
        setPlanningLabel: (state: TrackMergeState, action: PayloadAction<string | undefined>) => {
            state.planningLabel = action.payload;
        },
        setPlanningTitle: (state: TrackMergeState, action: PayloadAction<string | undefined>) => {
            state.planningTitle = action.payload;
        },
        setParticipantsDelays: (state: TrackMergeState, action: PayloadAction<number>) => {
            state.participantDelay = action.payload;
        },
        setAverageSpeed: (state: TrackMergeState, action: PayloadAction<number>) => {
            state.averageSpeedInKmH = action.payload;
        },
        setGapToleranceInKm: (state: TrackMergeState, action: PayloadAction<number | undefined>) => {
            state.gapToleranceInKm = action.payload;
        },
        setSegmentIdClipboard: (state: TrackMergeState, action: PayloadAction<undefined | string[]>) => {
            state.segmentIdClipboard = action.payload;
        },
        setTrackCompositionFilterTerm: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.filterTerm = action.payload;
        },
        setDefaultArrivalDateTime: (state: TrackMergeState) => {
            state.hasDefaultArrivalDate = true;
            state.arrivalDateTime = new Date().toISOString();
        },
        setTrackIdForAddingABreak: (state: TrackMergeState, action: PayloadAction<string | undefined>) => {
            state.trackIdForAddingABreak = action.payload;
        },
        setIsCalculationRunning: (state: TrackMergeState, action: PayloadAction<boolean | undefined>) => {
            state.isCalculationRunning = action.payload;
        },
        clear: () => initialState,
    },
});

export const trackMergeActions = trackMergeSlice.actions;
export const trackMergeReducer: Reducer<TrackMergeState> = trackMergeSlice.reducer;
const getBase = (state: State) => state.trackMerge;
export const getTrackCompositions = (state: State) => getBase(state).trackCompositions;
export const getTrackCompositionFilterTerm = (state: State) => getBase(state).filterTerm;
export const getArrivalDateTime = (state: State) => getBase(state).arrivalDateTime;
export const getHasDefaultArrivalDateTime = (state: State) => getBase(state).hasDefaultArrivalDate;
export const getPlanningLabel = (state: State) => getBase(state).planningLabel;
export const getPlanningTitle = (state: State) => getBase(state).planningTitle;
export const getParticipantsDelay = (state: State) => getBase(state).participantDelay;
export const getAverageSpeedInKmH = (state: State) => getBase(state).averageSpeedInKmH ?? DEFAULT_AVERAGE_SPEED_IN_KM_H;
export const getGapToleranceInKm = (state: State) => getBase(state).gapToleranceInKm ?? DEFAULT_GAP_TOLERANCE;
export const getSegmentIdClipboard = (state: State) => getBase(state).segmentIdClipboard;
export const getTrackIdForAddingABreak = (state: State) => getBase(state).trackIdForAddingABreak;
export const getIsCalculationRunning = (state: State) => getBase(state).isCalculationRunning;

export const getFilteredTrackCompositions = createSelector(
    getTrackCompositions,
    getTrackCompositionFilterTerm,
    (tracks, filterTerm) => {
        return filterItems(filterTerm, tracks, (track: TrackComposition) => track.name);
    }
);
