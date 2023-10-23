import { GpxMergeLogic } from '../types.ts';
import { assembleTrackFromSegments } from './assembleTrackFromSegments.ts';

export const mergeAndAdjustTimes: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    return trackCompositions.map((track) => {
        return assembleTrackFromSegments(track, gpxSegments, arrivalDateTime);
    });
};
