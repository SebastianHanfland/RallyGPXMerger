import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { updateExtraDelayOnTracks } from './solver.ts';
import { assembleTrackFromSegments } from './helper/assembleTrackFromSegments.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { createSelector } from '@reduxjs/toolkit';
import { ParsedGpxSegment, TrackComposition } from '../../store/types.ts';

export const cachedTrackCompositions = createSelector([getTrackCompositions], (trackCompositions) => {
    return trackCompositions;
});

export const cachedParsedSegments = createSelector([getParsedGpxSegments], (segments) => {
    return segments;
});

export const calculateTracks = (trackCompositions: TrackComposition[], segments: ParsedGpxSegment[]) => {
    const trackWithEndDelay = updateExtraDelayOnTracks(trackCompositions);
    return trackWithEndDelay.map((track) => assembleTrackFromSegments(track, segments));
};
