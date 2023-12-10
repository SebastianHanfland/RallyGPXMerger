import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { CalculatedTrack, CalculatedTracksState, State } from './types';
import { storage } from './storage.ts';
import { getTrackCompositionFilterTerm } from './trackMerge.reducer.ts';

const initialState: CalculatedTracksState = {
    tracks: [],
    trackParticipants: [],
};

const calculatedTracksSlice = createSlice({
    name: 'calculatedTracks',
    initialState: storage.load()?.calculatedTracks ?? initialState,
    reducers: {
        setCalculatedTracks: (state: CalculatedTracksState, action: PayloadAction<CalculatedTrack[]>) => {
            state.tracks = action.payload;
        },
        setParticipants: (state: CalculatedTracksState, action: PayloadAction<number[]>) => {
            state.trackParticipants = action.payload;
        },
        removeCalculatedTracks: (state: CalculatedTracksState) => {
            state.tracks = [];
            state.trackParticipants = [];
        },
    },
});

export const calculatedTracksActions = calculatedTracksSlice.actions;
export const calculatedTracksReducer: Reducer<CalculatedTracksState> = calculatedTracksSlice.reducer;
const getBase = (state: State) => state.calculatedTracks;
export const getCalculatedTracks = (state: State) => getBase(state).tracks;
export const getTrackParticipants = (state: State) => getBase(state).trackParticipants ?? [1000, 2000];

export const getFilteredCalculatedTracks = createSelector(
    getCalculatedTracks,
    getTrackCompositionFilterTerm,
    (tracks, filterTerm) => {
        const allFilterTerms = filterTerm?.split(',');
        if (!filterTerm || !allFilterTerms) {
            return tracks;
        } else {
            return tracks.filter((track) => {
                let match = false;
                allFilterTerms.forEach((term) => {
                    if (term === '') {
                        return;
                    }
                    const matches = track.filename?.replace(/\s/g, '').includes(term.replace(/\s/g, ''));
                    if (matches) {
                        match = true;
                    }
                });
                return match;
            });
        }
    }
);
