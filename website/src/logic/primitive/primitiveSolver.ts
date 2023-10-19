import { GpxMergeLogic } from '../types.ts';

export const mergeTracks: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    console.log(arrivalDateTime, trackCompositions, gpxSegments);
    return trackCompositions.map((track) => ({ id: track.id, content: '', filename: track.name! }));
};
