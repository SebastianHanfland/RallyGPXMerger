import { NodeSpecifications, TrackComposition } from '../../../planner/store/types.ts';
import { listAllNodesOfTracks } from '../nodes/nodeFinder.ts';

export const getBranchId = (trackIds: string[]): string => {
    const sortedIds = trackIds.sort();
    return sortedIds.join('-');
};

export const getBranchNumbers = (
    nodeSpecs: NodeSpecifications,
    trackCompositions: TrackComposition[]
): Record<string, number> => {
    const trackNodes = listAllNodesOfTracks(trackCompositions).sort((a, b) =>
        a.segmentsBeforeNode.length > b.segmentsBeforeNode.length ? 1 : -1
    );

    const correctedSegmentPeople: Record<string, number> = {};
    trackCompositions.forEach((track) => {
        correctedSegmentPeople[track.id] = track.peopleCount ?? 0;
    });

    trackNodes.forEach((trackNode) => {
        const nodeSpec = nodeSpecs[trackNode.segmentIdAfterNode];
        if (!nodeSpec) {
            return;
        }
        if (trackNode.segmentsBeforeNode.length === 2) {
            const segment1 = trackNode.segmentsBeforeNode[0];
            const segment2 = trackNode.segmentsBeforeNode[1];
            const size1 = (nodeSpec.trackOffsets[segment1.segmentId] ?? 0) + correctedSegmentPeople[segment1.trackId];
            const size2 = (nodeSpec.trackOffsets[segment2.segmentId] ?? 0) + correctedSegmentPeople[segment2.trackId];
            correctedSegmentPeople[getBranchId([segment1.trackId, segment2.trackId])] = Math.max(size1, size2);
        }
        // TODO: more segments, find branches etc, recycle branch info
    });

    return correctedSegmentPeople;
};
