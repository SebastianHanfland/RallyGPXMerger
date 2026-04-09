import { NodeSpecifications, TrackComposition } from '../../../planner/store/types.ts';
import { listAllNodesOfTracks, NodeAtTrack } from '../nodes/nodeFinder.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getNodeSpecifications } from '../../../planner/store/nodes.reducer.ts';
import { getTrackCompositions } from '../../../planner/store/trackMerge.reducer.ts';

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

export function getBranchTrackIds(trackNode: NodeAtTrack): Record<string, string[] | undefined> {
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
    nodeSpecs: NodeSpecifications | undefined,
    trackCompositions: TrackComposition[]
): Record<string, number | undefined> => {
    const trackNodes = listAllNodesOfTracks(trackCompositions).sort((a, b) =>
        a.segmentsBeforeNode.length > b.segmentsBeforeNode.length ? 1 : -1
    );

    const correctedSegmentPeople: Record<string, number | undefined> =
        initiallyFillWithSingleTrackPeople(trackCompositions);

    trackNodes.forEach((trackNode) => {
        const nodeSpec = (nodeSpecs ?? {})[trackNode.segmentIdAfterNode];
        const branchTracks = getBranchTrackIds(trackNode);
        if (!nodeSpec) {
            let afterNodeTrackIds: string[] = [];
            let peopleCounter = 0;
            Object.values(branchTracks).forEach((trackIds) => {
                if (trackIds) {
                    afterNodeTrackIds = [...afterNodeTrackIds, ...trackIds];
                    peopleCounter += correctedSegmentPeople[getBranchId(trackIds)] ?? 0;
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
                    const peopleSize = offset + (correctedSegmentPeople[getBranchId(trackIds)] ?? 0);
                    peopleSizeCounter = [...peopleSizeCounter, peopleSize];
                }
            });
            correctedSegmentPeople[getBranchId(afterNodeTrackIds)] = Math.max(...peopleSizeCounter);
        }
    });

    return correctedSegmentPeople;
};

export const getBranchNumbersSelector = createSelector([getNodeSpecifications, getTrackCompositions], getBranchNumbers);
