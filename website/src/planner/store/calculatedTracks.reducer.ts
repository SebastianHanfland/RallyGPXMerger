import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositionFilterTerm } from './trackMerge.reducer';
import { filterItems } from '../../utils/filterUtil';
import { CalculatedTrack } from '../../common/types';
import { getCalculateTracks } from '../calculation/getCalculatedTracks';

export const getFilteredCalculatedTracks = createSelector(
    [getCalculateTracks, getTrackCompositionFilterTerm],
    (tracks, filterTerm) => {
        return filterItems(filterTerm, tracks, (track: CalculatedTrack) => track.filename);
    }
);
