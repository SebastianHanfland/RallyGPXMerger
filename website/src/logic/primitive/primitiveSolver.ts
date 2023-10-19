import { GpxMergeLogic } from '../types.ts';
import { mergeGpxs } from '../gpxMerger.ts';
import { letTimeInGpxEndAt } from '../gpxTimeShifter.ts';
import { GpxSegment, TrackComposition } from '../../store/types.ts';
import { getStartTimeOfGpxTrack } from '../startTimeExtractor.ts';

function mergeGpxSegmentContents(gpxSegmentContents: string[]): string {
    let trackContent: string | undefined = undefined;

    gpxSegmentContents.forEach((segmentContent) => {
        if (!trackContent) {
            trackContent = segmentContent;
        } else {
            trackContent = mergeGpxs(trackContent, segmentContent);
        }
    });

    return trackContent!;
}

function resolveGpxSegments(track: TrackComposition, gpxSegments: GpxSegment[]) {
    return track.segmentIds.map((segmentId) => {
        const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);
        return gpxSegment!.content;
    });
}

export const mergeTracks: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    if (trackCompositions.length === 1 && trackCompositions[0].segmentIds.length === 1) {
        const track = trackCompositions[0];
        const segmentId = track.segmentIds[0];
        const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);

        const shiftedGpxContent = letTimeInGpxEndAt(gpxSegment!.content, arrivalDateTime);

        return [{ id: track.id, content: shiftedGpxContent, filename: track.name! }];
    }

    return trackCompositions.map((track) => {
        const gpxSegmentContents = resolveGpxSegments(track, gpxSegments);

        let shiftedGpxContents: string[] = [];
        let endDate = arrivalDateTime;

        gpxSegmentContents.reverse().forEach((content) => {
            const shiftedContent = letTimeInGpxEndAt(content, endDate);
            endDate = getStartTimeOfGpxTrack(shiftedContent);
            shiftedGpxContents = [shiftedContent, ...shiftedGpxContents];
        });

        const trackContent = mergeGpxSegmentContents(shiftedGpxContents);

        return { id: track.id, content: trackContent, filename: track.name! };
    });
};
