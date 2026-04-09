import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getNodeEditInfo, getNodeSpecifications } from '../store/nodes.reducer.ts';
import { listAllNodesOfTracks, NodeAtTrack } from '../../common/calculation/nodes/nodeFinder.ts';
import { NodeSpecification } from '../store/types.ts';
import { getBranchTracks } from './getBranchTracks.ts';
import {
    getDelaysOfTracks,
    TrackDelayDetails,
} from '../../common/calculation/calculated-tracks/getSpecifiedDelayPerTrack.ts';
import { getParticipantsDelay } from '../store/settings.reducer.ts';

function getDelaysOfTrackAtNode(
    delaysOfTracks: TrackDelayDetails[],
    foundTrackNode: NodeAtTrack,
    participantsDelay: number
): Record<string, number> {
    const delayOfTrackAtNode: Record<string, number> = {};

    delaysOfTracks
        .filter((trackDelay) =>
            trackDelay.delays.map((delay) => delay.segmentId).includes(foundTrackNode.segmentIdAfterNode)
        )
        .forEach((trackDelay) => {
            const foundDelay = trackDelay.delays.find((delay) => delay.segmentId === foundTrackNode.segmentIdAfterNode);
            delayOfTrackAtNode[trackDelay.trackId] = (foundDelay?.extraDelay ?? 0) / participantsDelay;
        });
    return delayOfTrackAtNode;
}

export const getBranchesAtNode = createSelector(
    getNodeEditInfo,
    getTrackCompositions,
    getNodeSpecifications,
    getParticipantsDelay,
    (nodeInfo, tracks, nodeSpecifications, participantsDelay): NodeSpecification | undefined => {
        const trackNodes = listAllNodesOfTracks(tracks);
        const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === nodeInfo?.segmentAfterId);
        if (nodeInfo?.segmentAfterId && nodeSpecifications) {
            const nodeSpecification = nodeSpecifications[nodeInfo?.segmentAfterId];
            if (nodeSpecification) {
                return nodeSpecification;
            }
        }
        if (!foundTrackNode) {
            return;
        }
        const branchTracks = getBranchTracks(foundTrackNode.segmentIdAfterNode, tracks);
        const delaysOfTracks = getDelaysOfTracks(tracks, participantsDelay, nodeSpecifications);
        const delayOfTrackAtNode = getDelaysOfTrackAtNode(delaysOfTracks, foundTrackNode, participantsDelay);

        const branchParticipants: Record<string, number> = {};
        const branchOffsets: Record<string, number> = {};

        let totalCount = 0;
        if (!branchTracks) {
            return;
        }

        Object.entries(branchTracks).forEach(([key, value]) => {
            value.forEach((track) => {
                totalCount = totalCount + (track.peopleCount ?? 0);
                branchParticipants[key] = (branchParticipants[key] ?? 0) + (track.peopleCount ?? 0);
                branchOffsets[key] = delayOfTrackAtNode[track.id];
            });
        });

        return { totalCount, trackOffsets: branchOffsets };
    }
);
