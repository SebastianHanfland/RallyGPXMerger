import { createSelector } from '@reduxjs/toolkit';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { getStartAndEndPlanning } from '../../utils/parsedTracksUtil.ts';
import { getParticipantsDelay, getTrackCompositions } from '../store/trackMerge.reducer.ts';

export const getMapStartAndEndTime = createSelector(
    getCalculatedTracks,
    getTrackCompositions,
    getParticipantsDelay,
    (calculatedTracks, tracks, participantsDelayInSeconds) => {
        return getStartAndEndPlanning(calculatedTracks, tracks, participantsDelayInSeconds);
    }
);
