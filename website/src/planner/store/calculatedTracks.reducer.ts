import { createSelector, createSlice, PayloadAction, Reducer } from '@reduxjs/toolkit';
import { CalculatedTracksState, State } from './types.ts';
import { storage } from './storage.ts';
import { getTrackCompositionFilterTerm } from './trackMerge.reducer.ts';
import { filterItems } from '../../utils/filterUtil.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { optionallyCompress, optionallyDecompress } from './compressHelper.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { setReadableTracks } from '../cache/readableTracks.ts';

const initialState: CalculatedTracksState = {
    tracks: [],
};

const calculatedTracksSlice = createSlice({
    name: 'calculatedTracks',
    initialState: storage.load()?.calculatedTracks ?? initialState,
    reducers: {
        setCalculatedTracks: (state: CalculatedTracksState, action: PayloadAction<CalculatedTrack[]>) => {
            state.tracks =
                action.payload?.map((track) => ({ ...track, content: optionallyCompress(track.content) })) ?? [];
        },
        removeCalculatedTracks: (state: CalculatedTracksState) => {
            state.tracks = [];
        },
        removeSingleCalculatedTrack: (state: CalculatedTracksState, action: PayloadAction<string>) => {
            state.tracks = state.tracks?.filter((track) => track.id !== action.payload);
            setReadableTracks(
                state.tracks?.map((track) => ({ id: track.id, gpx: SimpleGPX.fromString(track.content) })) ?? []
            );
        },
    },
});

export const calculatedTracksActions = calculatedTracksSlice.actions;
export const calculatedTracksReducer: Reducer<CalculatedTracksState> = calculatedTracksSlice.reducer;
const getBase = (state: State) => state.calculatedTracks;

export const getDecompressedCalculatedTracks = createSelector(
    (state: State) => getBase(state).tracks,
    (tracks) => {
        return tracks?.map((track) => ({ ...track, content: optionallyDecompress(track.content) })) ?? [];
    }
);
export const getCalculatedTracks = getDecompressedCalculatedTracks;

export const getFilteredCalculatedTracks = createSelector(
    getDecompressedCalculatedTracks,
    getTrackCompositionFilterTerm,
    (tracks, filterTerm) => {
        return filterItems(filterTerm, tracks, (track: CalculatedTrack) => track.filename);
    }
);
