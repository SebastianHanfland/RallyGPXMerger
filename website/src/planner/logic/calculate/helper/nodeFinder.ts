import { TrackComposition } from '../../../store/types.ts';
import { BREAK_IDENTIFIER } from '../types.ts';

export interface TrackNodeSegment {
    segmentId: string;
    trackId: string;
    amount: number;
    trackIdInsteadOfSegmentId?: boolean;
}

export interface TrackNode {
    segmentsBeforeNode: TrackNodeSegment[];
    segmentIdAfterNode: string;
}

export function findMultipleOccurrencesOfSegments(trackCompositions: TrackComposition[]): string[] {
    const occurredSegmentIds: string[] = [];
    const multipleSegmentIds: string[] = [];

    trackCompositions.forEach((track) => {
        track.segmentIds
            .filter((segmentId) => !segmentId.includes(BREAK_IDENTIFIER))
            .forEach((segmentId) => {
                if (occurredSegmentIds.includes(segmentId) && !multipleSegmentIds.includes(segmentId)) {
                    multipleSegmentIds.push(segmentId);
                } else {
                    occurredSegmentIds.push(segmentId);
                }
            });
    });
    return multipleSegmentIds;
}

export function listAllNodesOfTracks(trackCompositions: TrackComposition[]): TrackNode[] {
    const segmentIdsUsedMultipleTimes = findMultipleOccurrencesOfSegments(trackCompositions);
    return segmentIdsUsedMultipleTimes.map((segmentId) => {
        const segmentsBeforeNode: TrackNodeSegment[] = [];
        trackCompositions.forEach((track) => {
            const segmentsWithoutBreaks = track.segmentIds.filter((segmentId) => !segmentId.includes(BREAK_IDENTIFIER));
            const indexOfSegment = segmentsWithoutBreaks.indexOf(segmentId);
            if (indexOfSegment > 0) {
                const segmentIdBeforeNode = segmentsWithoutBreaks[indexOfSegment - 1];
                segmentsBeforeNode.push({
                    segmentId: segmentIdBeforeNode,
                    trackId: track.id,
                    amount: track?.peopleCount ?? 0,
                });
            } else if (indexOfSegment === 0) {
                segmentsBeforeNode.push({
                    segmentId: track.id,
                    trackId: track.id,
                    amount: track?.peopleCount ?? 0,
                    trackIdInsteadOfSegmentId: true,
                });
            }
        });

        return { segmentIdAfterNode: segmentId, segmentsBeforeNode };
    });
}
