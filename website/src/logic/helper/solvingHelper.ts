import { GpxSegment, TrackComposition } from '../../store/types.ts';
import { Break, BREAK_IDENTIFIER } from '../types.ts';
import { SimpleGPX } from '../gpxutils.ts';

export function mergeGpxSegmentContents(gpxSegmentContents: SimpleGPX[]): string {
    return new SimpleGPX(gpxSegmentContents).toString();
}

export function resolveGpxSegments(track: TrackComposition, gpxSegments: GpxSegment[]): (SimpleGPX | Break)[] {
    return track.segmentIds.map((segmentId) => {
        if (segmentId.includes(BREAK_IDENTIFIER)) {
            // meaning this segment is literally a break and nothing else
            const minutes = Number(segmentId.split(BREAK_IDENTIFIER)[0]);
            return { minutes };
        }
        const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);
        return gpxSegment!.content;
    });
}
