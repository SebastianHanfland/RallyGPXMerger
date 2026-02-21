import { createSelector } from '@reduxjs/toolkit';
import { getArrivalDateTime, getParticipantsDelay } from '../store/settings.reducer.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';
import { getNodeSpecifications } from '../store/nodes.reducer.ts';
import { calculateTracks } from '../../common/calculation/calculated-tracks/calculateTracks.ts';

export const getCalculateTracks = createSelector(
    [getArrivalDateTime, getTrackCompositions, getParsedGpxSegments, getParticipantsDelay, getNodeSpecifications],
    calculateTracks
);
