import { createSelector } from '@reduxjs/toolkit';
import { getStartAndEndPlanning } from '../../utils/parsedTracksUtil';
import { getTrackCompositions } from '../store/trackMerge.reducer';
import { getParticipantsDelay } from '../store/settings.reducer';
import { getCalculateTracks } from '../calculation/getCalculatedTracks';

export const getMapStartAndEndTime = createSelector(
    getCalculateTracks,
    getTrackCompositions,
    getParticipantsDelay,
    (calculatedTracks, tracks, participantsDelayInSeconds) => {
        return getStartAndEndPlanning(calculatedTracks, tracks, participantsDelayInSeconds);
    }
);
