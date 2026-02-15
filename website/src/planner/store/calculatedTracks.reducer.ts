import { createSelector } from '@reduxjs/toolkit';
import { State } from './types.ts';
import { getArrivalDateTime, getTrackCompositionFilterTerm } from './trackMerge.reducer.ts';
import { filterItems } from '../../utils/filterUtil.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { calculateTracks } from '../logic/calculate/calculateTracks.ts';
import { shiftDateBySeconds } from '../../utils/dateUtil.ts';

export const getCalculatedTracks = (state: State): CalculatedTrack[] => {
    const arrivalDateTime = getArrivalDateTime(state) ?? '2025-06-01T10:11:55';
    return calculateTracks(state).map((track) => ({
        ...track,
        points: track.points.map((point) => ({ ...point, t: shiftDateBySeconds(arrivalDateTime, point.t) })),
    }));
};

export const getFilteredCalculatedTracks = createSelector(
    getCalculatedTracks,
    getTrackCompositionFilterTerm,
    (tracks, filterTerm) => {
        return filterItems(filterTerm, tracks, (track: CalculatedTrack) => track.filename);
    }
);
