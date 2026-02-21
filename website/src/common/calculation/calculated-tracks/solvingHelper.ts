import { BREAK, ParsedGpxSegment, TrackComposition } from '../../../planner/store/types.ts';
import { Break } from '../../../planner/logic/calculate/types.ts';

export function resolveGpxSegments(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[]
): (ParsedGpxSegment | Break)[] {
    return track.segments.map((trackElement) => {
        if (trackElement.type === BREAK) {
            const minutes = trackElement.minutes;
            return { minutes };
        }
        const gpxSegment = gpxSegments.find((segment) => segment.id === trackElement.id);
        return gpxSegment!;
    });
}
