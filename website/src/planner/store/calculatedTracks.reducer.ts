import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositionFilterTerm } from './trackMerge.reducer.ts';
import { filterItems } from '../../utils/filterUtil.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { getCalculateTracks } from '../calculation/getCalculatedTracks.ts';

export const getFilteredCalculatedTracks = createSelector(
    [getCalculateTracks, getTrackCompositionFilterTerm],
    (tracks, filterTerm) => {
        return filterItems(filterTerm, tracks, (track: CalculatedTrack) => track.filename);
    }
);
