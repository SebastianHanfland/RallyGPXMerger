import { NodeSpecifications, TrackComposition } from '../../../planner/store/types.ts';
import { listAllNodesOfTracks, TrackNode } from '../nodes/nodeFinder.ts';

export const getBranchId = (trackIds: string[]): string => {
    const sortedIds = trackIds.sort();
    return sortedIds.join('-');
};

function initiallyFillWithSingleTrackPeople(trackCompositions: TrackComposition[]) {
    const correctedSegmentPeople: Record<string, number> = {};
    trackCompositions.forEach((track) => {
        correctedSegmentPeople[track.id] = track.peopleCount ?? 0;
    });
    return correctedSegmentPeople;
}

function getBranchTracks(trackNode: TrackNode) {
    const branchTracks: Record<string, string[] | undefined> = {};
    trackNode.segmentsBeforeNode.forEach((beforeSegment) => {
        branchTracks[beforeSegment.segmentId] = [
            ...(branchTracks[beforeSegment.segmentId] ?? []),
            beforeSegment.trackId,
        ];
    });
    return branchTracks;
}

export const getBranchNumbers = (
    nodeSpecs: NodeSpecifications,
    trackCompositions: TrackComposition[]
): Record<string, number> => {
    const trackNodes = listAllNodesOfTracks(trackCompositions).sort((a, b) =>
        a.segmentsBeforeNode.length > b.segmentsBeforeNode.length ? 1 : -1
    );

    const correctedSegmentPeople = initiallyFillWithSingleTrackPeople(trackCompositions);

    trackNodes.forEach((trackNode) => {
        const nodeSpec = nodeSpecs[trackNode.segmentIdAfterNode];
        if (!nodeSpec) {
            const branchTracks = getBranchTracks(trackNode);
            let afterNodeTrackIds: string[] = [];
            let peopleCounter = 0;
            Object.values(branchTracks).forEach((trackIds) => {
                if (trackIds) {
                    afterNodeTrackIds = [...afterNodeTrackIds, ...trackIds];
                    peopleCounter += correctedSegmentPeople[getBranchId(trackIds)];
                }
            });
            correctedSegmentPeople[getBranchId(afterNodeTrackIds)] = peopleCounter;
        } else {
            // TODO: handle node specs
        }
    });

    console.log(correctedSegmentPeople);
    return correctedSegmentPeople;
};
//
// if (trackNode.segmentsBeforeNode.length === 2) {
//     const segment1 = trackNode.segmentsBeforeNode[0];
//     const segment2 = trackNode.segmentsBeforeNode[1];
//     const size1 =
//         (nodeSpec.trackOffsets[segment1.segmentId] ?? 0) + correctedSegmentPeople[segment1.trackId];
//     const size2 =
//         (nodeSpec.trackOffsets[segment2.segmentId] ?? 0) + correctedSegmentPeople[segment2.trackId];
//     correctedSegmentPeople[getBranchId([segment1.trackId, segment2.trackId])] = Math.max(size1, size2);
// }
