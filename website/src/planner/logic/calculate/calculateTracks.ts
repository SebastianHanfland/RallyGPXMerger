import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { updateExtraDelayOnTracks } from './solver.ts';
import { assembleTrackFromSegments } from './helper/assembleTrackFromSegments.ts';
import { getParsedGpxSegments } from '../../store/segmentData.redux.ts';
import { createSelector } from '@reduxjs/toolkit';
import { ParsedGpxSegment, TrackComposition } from '../../store/types.ts';

export const cachedTrackCompositions = createSelector([getTrackCompositions], (trackCompositions) => {
    console.log('tracks');
    return trackCompositions;
});

export const cachedParsedSegments = createSelector([getParsedGpxSegments], (segments) => {
    console.log('segments');
    return segments;
});

export const getInfo = createSelector([getParsedGpxSegments, getTrackCompositions], (segments, tracks) => {
    console.log('segments and tracks');
    return segments.length + tracks.length;
});

// export const calculateTracks = createSelector(
//     [cachedTrackCompositions, cachedParsedSegments],
//     (trackCompositions, segments) => {
//         const trackWithEndDelay = updateExtraDelayOnTracks(trackCompositions);
//         console.log('Calcs');
//         // when I return an empty list here it seems to work
//         // maybe I have to bring all of them together as a selector and am not allowed to use the result of it
//         return trackWithEndDelay.map((track) => assembleTrackFromSegments(track, segments));
//     }
// );

export const calculateTracks =
    (place: string) => (trackCompositions: TrackComposition[], segments: ParsedGpxSegment[]) => {
        const trackWithEndDelay = updateExtraDelayOnTracks(trackCompositions);
        console.log('Calcs' + place);
        // when I return an empty list here it seems to work
        // maybe I have to bring all of them together as a selector and am not allowed to use the result of it
        return trackWithEndDelay.map((track) => assembleTrackFromSegments(track, segments));
    };
