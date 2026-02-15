import { ParsedGpxSegment, TrackComposition } from '../../../store/types.ts';
import { Break, BREAK_IDENTIFIER } from '../../merge/types.ts';

export function resolveGpxSegments(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[]
): (ParsedGpxSegment | Break)[] {
    return track.segmentIds.map((segmentId) => {
        if (segmentId.includes(BREAK_IDENTIFIER)) {
            // meaning this segment is literally a break and nothing else
            const minutes = Number(segmentId.split(BREAK_IDENTIFIER)[0]);
            return { minutes };
        }
        const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);
        return gpxSegment!;
    });
}
