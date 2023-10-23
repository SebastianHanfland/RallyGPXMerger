import { GpxSegment, TrackComposition } from '../../store/types.ts';

export interface TrackNode {
    segmentsBeforeNode: { segmentId: string; trackId: string; amount?: number }[];
    segmentIdAfterNode: string;
}

export function findMultipleOccurrencesOfSegments(trackCompositions: TrackComposition[]): string[] {
    const occurredSegmentIds: string[] = [];
    const multipleSegmentIds: string[] = [];

    trackCompositions.forEach((track) => {
        track.segmentIds.forEach((segmentId) => {
            if (occurredSegmentIds.includes(segmentId) && !multipleSegmentIds.includes(segmentId)) {
                multipleSegmentIds.push(segmentId);
            } else {
                occurredSegmentIds.push(segmentId);
            }
        });
    });
    return multipleSegmentIds;
}

export function listAllNodesOfTracks(trackCompositions: TrackComposition[], gpxSegments: GpxSegment[]): TrackNode[] {
    const segmentIdsUsedMultipleTimes = findMultipleOccurrencesOfSegments(trackCompositions);
    return segmentIdsUsedMultipleTimes.map((segmentId) => {
        const segmentsBeforeNode: { segmentId: string; trackId: string; amount?: number }[] = [];
        trackCompositions.forEach((track) => {
            const indexOfSegment = track.segmentIds.indexOf(segmentId);
            if (indexOfSegment > 0) {
                const segmentIdBeforeNode = track.segmentIds[indexOfSegment - 1];
                const gpxSegment = gpxSegments.find((segment) => segment.id === segmentIdBeforeNode);
                segmentsBeforeNode.push({
                    segmentId: segmentIdBeforeNode,
                    trackId: track.id,
                    amount: gpxSegment?.peopleCountEnd,
                });
            }
        });

        return { segmentIdAfterNode: segmentId, segmentsBeforeNode };
    });
}