import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { BreakEditInfo, State, TrackComposition, TrackElement, TrackMergeState } from './types.ts';
import { storage } from './storage.ts';
import { v4 as uuidv4 } from 'uuid';
import { filterItems } from '../../utils/filterUtil.ts';

const initialState: TrackMergeState = {
    trackCompositions: [],
};

const trackMergeSlice = createSlice({
    name: 'trackMerge',
    initialState: storage.load()?.trackMerge ?? initialState,
    reducers: {
        addTrackComposition: (state: TrackMergeState, action: PayloadAction<TrackComposition | undefined>) => {
            if (action.payload) {
                state.trackCompositions = [...state.trackCompositions, action.payload];
            } else {
                state.trackCompositions = [...state.trackCompositions, { id: uuidv4(), segments: [], name: '' }];
            }
        },
        removeTrackComposition: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.trackCompositions = state.trackCompositions.filter((track) => track.id !== action.payload);
        },
        setSegments: (state: TrackMergeState, action: PayloadAction<{ id: string; segments: TrackElement[] }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, segments: action.payload.segments } : track
            );
        },
        removeSegmentFromTrack: (state: TrackMergeState, action: PayloadAction<{ id: string; segmentId: string }>) => {
            const segmentId = action.payload.segmentId;

            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id
                    ? { ...track, segments: track.segments.filter((sId) => sId.id !== segmentId) }
                    : track
            );
        },
        setTrackName: (state: TrackMergeState, action: PayloadAction<{ id: string; trackName: string }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, name: action.payload.trackName } : track
            );
            state.filterTerm = undefined;
        },
        setTrackColor: (state: TrackMergeState, action: PayloadAction<{ id: string; color: string | undefined }>) => {
            state.trackCompositions = state.trackCompositions.map((track) =>
                track.id === action.payload.id ? { ...track, color: action.payload.color } : track
            );
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
                segments: track.segments.filter((segmentId) => segmentId.id !== action.payload),
            }));
        },
        setSegmentIdClipboard: (state: TrackMergeState, action: PayloadAction<undefined | TrackElement[]>) => {
            state.segmentIdClipboard = action.payload;
        },
        setTrackCompositionFilterTerm: (state: TrackMergeState, action: PayloadAction<string>) => {
            state.filterTerm = action.payload;
        },
        setTrackIdForAddingABreak: (state: TrackMergeState, action: PayloadAction<string | undefined>) => {
            state.trackIdForAddingABreak = action.payload;
        },
        setBreakEditInfo: (state: TrackMergeState, action: PayloadAction<BreakEditInfo | undefined>) => {
            state.breakEditInfo = action.payload;
        },
        clear: () => initialState,
    },
});

export const trackMergeActions = trackMergeSlice.actions;
export const trackMergeReducer: Reducer<TrackMergeState> = trackMergeSlice.reducer;
const getBase = (state: State) => state.trackMerge;
export const getTrackCompositions = (state: State) => getBase(state).trackCompositions;
export const getTrackCompositionFilterTerm = (state: State) => getBase(state).filterTerm;
export const getSegmentIdClipboard = (state: State) => getBase(state).segmentIdClipboard;
export const getTrackIdForAddingABreak = (state: State) => getBase(state).trackIdForAddingABreak;
export const getBreakEditInfo = (state: State) => getBase(state).breakEditInfo;

export const getFilteredTrackCompositions = createSelector(
    getTrackCompositions,
    getTrackCompositionFilterTerm,
    (tracks, filterTerm) => {
        return filterItems(filterTerm, tracks, (track: TrackComposition) => track.name);
    }
);
