import { Break, BREAK_IDENTIFIER, GpxMergeLogic } from '../types.ts';
import { mergeGpxs } from '../gpxMerger.ts';
import { letTimeInGpxEndAt } from '../gpxTimeShifter.ts';
import { GpxSegment, TrackComposition } from '../../store/types.ts';
import { getStartTimeOfGpxTrack } from '../startTimeExtractor.ts';
import { shiftEndDate } from '../shiftEndDate.ts';

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

function resolveGpxSegments(track: TrackComposition, gpxSegments: GpxSegment[]): (string | Break)[] {
    return track.segmentIds.map((segmentId) => {
        if (segmentId.includes(BREAK_IDENTIFIER)) {
            const minutes = Number(segmentId.split(BREAK_IDENTIFIER)[0]);
            return { minutes };
        }
        const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);
        return gpxSegment!.content;
    });
}

export const mergeTracks: GpxMergeLogic = (gpxSegments, trackCompositions, arrivalDateTime) => {
    return trackCompositions.map((track) => {
        const gpxSegmentContents = resolveGpxSegments(track, gpxSegments);

        let shiftedGpxContents: string[] = [];
        let endDate = arrivalDateTime;

        gpxSegmentContents.reverse().forEach((content) => {
            if (typeof content === 'string') {
                const shiftedContent = letTimeInGpxEndAt(content, endDate);
                endDate = getStartTimeOfGpxTrack(shiftedContent);
                shiftedGpxContents = [shiftedContent, ...shiftedGpxContents];
            } else {
                endDate = shiftEndDate(endDate, content.minutes);
            }
        });

        const trackContent = mergeGpxSegmentContents(shiftedGpxContents);

        return { id: track.id, content: trackContent, filename: track.name! };
    });
};
