import { GpxSegment, TrackComposition } from '../../store/types.ts';
import { Break, BREAK_IDENTIFIER } from '../types.ts';
import { mergeGpxs } from '../gpxMerger.ts';

export function mergeGpxSegmentContents(gpxSegmentContents: string[]): string {
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

export function resolveGpxSegments(track: TrackComposition, gpxSegments: GpxSegment[]): (string | Break)[] {
    return track.segmentIds.map((segmentId) => {
        if (segmentId.includes(BREAK_IDENTIFIER)) {
            const minutes = Number(segmentId.split(BREAK_IDENTIFIER)[0]);
            return { minutes };
        }
        const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);
        return gpxSegment!.content;
    });
}
