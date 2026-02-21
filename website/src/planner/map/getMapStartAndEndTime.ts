import { createSelector } from '@reduxjs/toolkit';
import { getStartAndEndPlanning } from '../../utils/parsedTracksUtil.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getParticipantsDelay } from '../store/settings.reducer.ts';
import { getCalculateTracks } from '../calculation/getCalculatedTracks.ts';

export const getMapStartAndEndTime = createSelector(
    getCalculateTracks,
    getTrackCompositions,
    getParticipantsDelay,
    (calculatedTracks, tracks, participantsDelayInSeconds) => {
        return getStartAndEndPlanning(calculatedTracks, tracks, participantsDelayInSeconds);
    }
);
