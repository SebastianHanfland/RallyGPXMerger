import { createSelector } from '@reduxjs/toolkit';
import { filterItems } from '../../utils/filterUtil';
import { State, TrackComposition } from './types';

const getBase = (state: State) => state.trackMerge;
export const getTrackCompositions = (state: State) => getBase(state).trackCompositions;
export const getTrackCompositionFilterTerm = (state: State) => getBase(state).filterTerm;
export const getSegmentIdClipboard = (state: State) => getBase(state).segmentIdClipboard;
export const getTrackIdForAddingABreak = (state: State) => getBase(state).trackIdForAddingABreak;
export const getTrackIdForAddingAnEntryPoint = (state: State) => getBase(state).trackIdForAddingAnEntryPoint;
export const getBreakInsertionIndex = (state: State) => getBase(state).breakInsertionIndex;
export const getEntryPointInsertionIndex = (state: State) => getBase(state).entryPointInsertionIndex;
export const getBreakEditInfo = (state: State) => getBase(state).breakEditInfo;
export const getEntryPointEditInfo = (state: State) => getBase(state).entryPointEditInfo;
export const getFilteredTrackCompositions = createSelector(
    getTrackCompositions,
    getTrackCompositionFilterTerm,
    (tracks, filterTerm) => filterItems(filterTerm, tracks, (track: TrackComposition) => track.name)
);
