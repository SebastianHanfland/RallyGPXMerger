import { BREAK_IDENTIFIER } from '../types.ts';
import { GpxSegment, TrackComposition } from '../../store/types.ts';

export function calculateParticipants(gpxSegments: GpxSegment[], trackCompositions: TrackComposition[]): number[] {
    return trackCompositions.map((track) => {
        const participantsOnSegments = track.segmentIds.map((segmentId) => {
            if (segmentId.includes(BREAK_IDENTIFIER)) {
                return 0;
            }
            const gpxSegment = gpxSegments.find((segment) => segment.id === segmentId);
            return gpxSegment?.peopleCountEnd ?? 0;
        });
        const notZeroParticipants = participantsOnSegments.filter((participants) => participants > 0);
        if (notZeroParticipants.length > 0) {
            return notZeroParticipants[0];
        }
        return 0;
    });
}
