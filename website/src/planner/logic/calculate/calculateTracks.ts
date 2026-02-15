import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { updateExtraDelayOnTracks } from './solver.ts';
import { assembleTrackFromSegments } from './helper/assembleTrackFromSegments.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { createSelector } from '@reduxjs/toolkit';

export const calculateTracks = createSelector(
    getTrackCompositions,
    getParsedGpxSegments,
    (trackCompositions, segments) => {
        const trackWithEndDelay = updateExtraDelayOnTracks(trackCompositions);

        return trackWithEndDelay.map((track) => assembleTrackFromSegments(track, segments));
    }
);
