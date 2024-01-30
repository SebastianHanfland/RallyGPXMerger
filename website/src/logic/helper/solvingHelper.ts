import { TrackComposition } from '../../planner/store/types.ts';
import { Break, BREAK_IDENTIFIER } from '../types.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { GpxSegment } from '../../common/types.ts';

export function resolveGpxSegments(track: TrackComposition, gpxSegments: GpxSegment[]): (SimpleGPX | Break)[] {
    return track.segmentIds.map((segmentId) => {
        if (segmentId.includes(BREAK_IDENTIFIER)) {
            // meaning this segment is literally a break and nothing else
            const minutes = Number(segmentId.split(BREAK_IDENTIFIER)[0]);
            return { minutes };
        }
        const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);
        return SimpleGPX.fromString(gpxSegment!.content);
    });
}
