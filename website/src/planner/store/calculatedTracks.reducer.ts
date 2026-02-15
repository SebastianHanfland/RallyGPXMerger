import { createSelector } from '@reduxjs/toolkit';
import { State } from './types.ts';
import { getTrackCompositionFilterTerm } from './trackMerge.reducer.ts';
import { filterItems } from '../../utils/filterUtil.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { calculateTracks } from '../logic/calculate/calculateTracks.ts';

export const getCalculatedTracks = (state: State) => calculateTracks(state);

export const getFilteredCalculatedTracks = createSelector(
    getCalculatedTracks,
    getTrackCompositionFilterTerm,
    (tracks, filterTerm) => {
        return filterItems(filterTerm, tracks, (track: CalculatedTrack) => track.filename);
    }
);
