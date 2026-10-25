import { createSelector } from '@reduxjs/toolkit';
import { getArrivalDateTime, getParticipantsDelay } from '../store/settings.reducer';
import { getTrackCompositions } from '../store/trackMerge.reducer';
import { getParsedGpxSegments } from '../store/segmentData.redux';
import { getNodeSpecifications } from '../store/nodes.reducer';
import { calculateTracks } from '../../common/calculation/calculated-tracks/calculateTracks';

export const getCalculateTracks = createSelector(
    [getArrivalDateTime, getTrackCompositions, getParsedGpxSegments, getParticipantsDelay, getNodeSpecifications],
    calculateTracks
);
