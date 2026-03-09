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
        const branchTracks = getBranchTracks(trackNode);
        if (!nodeSpec) {
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
            let afterNodeTrackIds: string[] = [];
            let peopleSizeCounter: number[] = [];
            Object.entries(branchTracks).forEach(([segmentId, trackIds]) => {
                if (trackIds) {
                    afterNodeTrackIds = [...afterNodeTrackIds, ...trackIds];
                    const offset = nodeSpec.trackOffsets[segmentId] ?? 0;
                    const peopleSize = offset + correctedSegmentPeople[getBranchId(trackIds)];
                    peopleSizeCounter = [...peopleSizeCounter, peopleSize];
                }
            });
            correctedSegmentPeople[getBranchId(afterNodeTrackIds)] = Math.max(...peopleSizeCounter);
        }
    });

    return correctedSegmentPeople;
};
