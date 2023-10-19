import { GpxSegment, TrackComposition } from '../../store/types.ts';

export interface TrackNode {
    segmentsBeforeNode: { segmentId: string; trackIds: string[]; amount: number }[];
    segmentIdAfterNode: string;
}

export function listAllNodesOfTracks(trackCompositions: TrackComposition[], gpxSegments: GpxSegment[]): TrackNode[] {
    return [];
}
