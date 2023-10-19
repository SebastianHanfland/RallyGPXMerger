import { GpxSegment, TrackComposition } from '../../store/types.ts';

export interface TrackNode {
    segmentsBeforeNode: { segmentId: string; trackIds: string[]; amount: number }[];
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
    return [];
}
