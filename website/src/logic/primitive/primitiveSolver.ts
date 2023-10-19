import { GpxMergeLogic } from '../types.ts';
import { mergeGpxs } from '../gpxMerger.ts';

export const mergeTracks: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    return trackCompositions.map((track) => {
        let trackContent: string;

        track.segmentIds.forEach((segmentId) => {
            const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);
            if (!trackContent) {
                trackContent = gpxSegment!.content;
            } else {
                trackContent = mergeGpxs(trackContent, gpxSegment!.content);
            }
        });

        return { id: track.id, content: trackContent!, filename: track.name! };
    });
};
