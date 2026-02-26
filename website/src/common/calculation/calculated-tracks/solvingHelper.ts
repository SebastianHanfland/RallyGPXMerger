import { BREAK, ParsedGpxSegment, TrackBreak, TrackComposition } from '../../../planner/store/types.ts';

export function resolveGpxSegments(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[]
): (ParsedGpxSegment | TrackBreak)[] {
    return track.segments.map((trackElement) => {
        if (trackElement.type === BREAK) {
            return trackElement;
        }
        const gpxSegment = gpxSegments.find((segment) => segment.id === trackElement.id);
        return gpxSegment!;
    });
}
