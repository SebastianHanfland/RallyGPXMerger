import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../store/trackMerge.reducer';
import { getParsedGpxSegments } from '../store/segmentData.redux';
import { getGapToleranceInKm } from '../store/settings.reducer';
import { calculateGaps } from '../../common/calculation/gaps/calculateGaps';

export const getGaps = createSelector([getTrackCompositions, getParsedGpxSegments, getGapToleranceInKm], calculateGaps);
