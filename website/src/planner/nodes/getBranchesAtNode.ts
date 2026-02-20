import { createSelector } from '@reduxjs/toolkit';
import { getNodeEditInfo, getNodeSpecifications, getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { listAllNodesOfTracks } from '../logic/calculate/helper/nodeFinder.ts';
import { NodeSpecification, TrackComposition } from '../store/types.ts';

export const getBranchTracks = (segmentAfterId: string, tracks: TrackComposition[]) => {
    const trackNodes = listAllNodesOfTracks(tracks);
    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === segmentAfterId);
    if (!foundTrackNode) {
        return undefined;
    }
    const branchSegmentIds = [...new Set(foundTrackNode.segmentsBeforeNode.map((segment) => segment.segmentId))];

    const branchTracks: Record<string, TrackComposition[]> = {};
    branchSegmentIds.forEach((branchId) => {
        branchTracks[branchId] = tracks.filter((track) =>
            track.segments.map((segment) => segment.id).includes(branchId)
        );
    });
    return branchTracks;
};

export const getBranchesAtNode = createSelector(
    getNodeEditInfo,
    getTrackCompositions,
    getNodeSpecifications,
    (nodeInfo, tracks, nodeSpecifications): NodeSpecification | undefined => {
        const trackNodes = listAllNodesOfTracks(tracks);
        const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === nodeInfo?.segmentAfterId);
        if (nodeInfo?.segmentAfterId && nodeSpecifications) {
            const nodeSpecification = nodeSpecifications[nodeInfo?.segmentAfterId];
            console.log('here?');
            if (nodeSpecification) {
                console.log('here as well?');
                return nodeSpecification;
            }
        }
        if (!foundTrackNode) {
            return;
        }
        const branchTracks = getBranchTracks(foundTrackNode.segmentIdAfterNode, tracks);

        const branchParticipants: Record<string, number> = {};
        let totalCount = 0;
        if (!branchTracks) {
            return;
        }
        Object.entries(branchTracks).forEach(([key, value]) => {
            value.forEach((track) => {
                totalCount = totalCount + (track.peopleCount ?? 0);
                branchParticipants[key] = (branchParticipants[key] ?? 0) + (track.peopleCount ?? 0);
            });
        });

        const branchOffsets: Record<string, number> = {};
        const sortedBranches = Object.entries(branchParticipants).sort((a, b) => (a[1] > b[1] ? 1 : -1));
        sortedBranches.forEach(([segmentId], index) => {
            if (index === 0) {
                branchOffsets[segmentId] = 0;
                return;
            }
            let participantsBefore = 0;
            sortedBranches.forEach((branch, counter) => {
                if (counter < index) {
                    participantsBefore = participantsBefore + branch[1];
                }
            });
            branchOffsets[segmentId] = participantsBefore;
        });

        return { totalCount, trackOffsets: branchOffsets };
    }
);
