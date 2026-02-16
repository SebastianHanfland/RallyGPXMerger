import { createSelector } from '@reduxjs/toolkit';
import {
    getArrivalDateTime,
    getParticipantsDelay,
    getTrackCompositionFilterTerm,
    getTrackCompositions,
} from './trackMerge.reducer.ts';
import { filterItems } from '../../utils/filterUtil.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { calculateTracks } from '../logic/calculate/calculateTracks.ts';
import { shiftDateBySeconds } from '../../utils/dateUtil.ts';
import { getParsedGpxSegments } from './segmentData.redux.ts';

export const getCalculatedTracks = createSelector(
    [getArrivalDateTime, getTrackCompositions, getParsedGpxSegments, getParticipantsDelay],
    (arrivalDate, trackCompositions, segments, participantsDelayInSeconds) => {
        const calculatedTracks = calculateTracks(trackCompositions, segments, participantsDelayInSeconds);
        const arrivalDateTime = arrivalDate ?? '2025-06-01T10:11:55';
        return calculatedTracks.map((track) => ({
            ...track,
            points: track.points.map((point) => ({ ...point, t: shiftDateBySeconds(arrivalDateTime, point.t) })),
        }));
    }
);

export const getFilteredCalculatedTracks = createSelector(
    getCalculatedTracks,
    getTrackCompositionFilterTerm,
    (tracks, filterTerm) => {
        return filterItems(filterTerm, tracks, (track: CalculatedTrack) => track.filename);
    }
);
