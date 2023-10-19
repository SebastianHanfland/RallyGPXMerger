import { GpxMergeLogic } from '../types.ts';
import { mergeGpxs } from '../gpxMerger.ts';
import { letTimeInGpxEndAt } from '../gpxTimeShifter.ts';

export const mergeTracks: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    if (trackCompositions.length === 1 && trackCompositions[0].segmentIds.length === 1) {
        const track = trackCompositions[0];
        const segmentId = track.segmentIds[0];
        const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);

        const shiftedGpxContent = letTimeInGpxEndAt(gpxSegment!.content, arrivalDateTime);

        return [{ id: track.id, content: shiftedGpxContent, filename: track.name! }];
    }

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
