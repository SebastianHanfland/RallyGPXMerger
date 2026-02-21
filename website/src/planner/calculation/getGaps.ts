import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getParsedGpxSegments } from '../store/segmentData.redux.ts';
import { getGapToleranceInKm } from '../store/settings.reducer.ts';
import { calculateGaps } from '../../common/calculation/gaps/calculateGaps.ts';

export const getGaps = createSelector([getTrackCompositions, getParsedGpxSegments, getGapToleranceInKm], calculateGaps);
