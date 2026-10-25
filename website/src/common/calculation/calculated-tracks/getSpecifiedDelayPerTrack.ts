import { NODE_SPEC, NodeSpecifications, PEOPLE, PRIORITY, TrackComposition } from '../../../planner/store/types';
import { trackNodesBySegmentSize } from '../nodes/nodeFinder';
import { getBranchId, getBranchNumbers, getBranchTrackIds } from './nodeSpecResultingBranchSize';
import { getBranchPriorities } from './getBranchPriorities';
import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../../../planner/store/trackMerge.reducer';
import { getParticipantsDelay } from '../../../planner/store/settings.reducer';
import { getNodeSpecifications } from '../../../planner/store/nodes.reducer';
import { getNodeOffset } from './nodeSpecOffset';
import {
    TrackDelayDetails,
    getPossibleNodeSpecification,
    hasPrioritiesSet,
    initializeTrackDelayDetails,
    setDelay,
} from './delayRules';

export type { TrackDelay, TrackDelayDetails } from './delayRules';

export const getDelaysOfTracks = (
    trackCompositions: TrackComposition[],
    delayPerPerson: number,
    nodeSpecifications: NodeSpecifications | undefined
): TrackDelayDetails[] => {
    const trackNodes = trackNodesBySegmentSize(trackCompositions);
    const branchNumbers = getBranchNumbers(nodeSpecifications ?? {}, trackCompositions);

    let trackDelays: TrackDelayDetails[] = trackCompositions.map(initializeTrackDelayDetails(trackNodes));

    trackNodes.forEach((trackNode) => {
        const segmentId = trackNode.segmentIdAfterNode;
        const priorityCounter = getBranchPriorities(segmentId, trackCompositions);
        const foundNodeSpec = getPossibleNodeSpecification(nodeSpecifications, segmentId);

        ///////////////////////////
        // Node Spec
        //////////////////////////
        if (foundNodeSpec) {
            const branchSizes = Object.fromEntries(
                Object.entries(getBranchTrackIds(trackNode)).map(([segId, trackIds]) => [
                    segId,
                    trackIds ? (branchNumbers[getBranchId(trackIds)] ?? 0) : 0,
                ])
            );
            const total = Object.values(branchSizes).reduce((sum, size) => sum + size, 0);
            const segmentIds =
                foundNodeSpec.trackOffsetPercentages !== undefined
                    ? Object.keys(getBranchTrackIds(trackNode))
                    : Object.keys(foundNodeSpec.trackOffsets ?? {});
            segmentIds.forEach((segId) => {
                const offset = getNodeOffset(foundNodeSpec, segId, branchSizes[segId] ?? 0, total);
                const tracksWithSegment = trackCompositions.filter((track) =>
                    track.segments.map((segment) => segment.id).includes(segId)
                );
                tracksWithSegment.forEach((track) => {
                    trackDelays = setDelay(trackDelays, track.id, segmentId, NODE_SPEC, offset * delayPerPerson);
                });
            });
        } else if (hasPrioritiesSet(priorityCounter)) {
            ///////////////////////////
            // Priority
            //////////////////////////
            const branchTrackIds = getBranchTrackIds(trackNode);

            const branchPeopleOnSegment: { segmentId: string; people: number; trackIds: string[]; priority: number }[] =
                [];
            Object.entries(branchTrackIds).forEach(([segId, trackIds]) => {
                if (trackIds) {
                    const people = branchNumbers[getBranchId(trackIds)] ?? 0;
                    const priority = priorityCounter[segId] ?? 0;
                    branchPeopleOnSegment.push({ segmentId: segId, people, trackIds, priority });
                }
            });

            let previousBranchesPeopleCounter = 0;
            const sortedBranches = branchPeopleOnSegment.sort((a, b) => (a.priority < b.priority ? 1 : -1));
            sortedBranches.forEach((branch) => {
                branch.trackIds.forEach((trackId) => {
                    trackDelays = setDelay(
                        trackDelays,
                        trackId,
                        segmentId,
                        PRIORITY,
                        previousBranchesPeopleCounter * delayPerPerson
                    );
                });
                previousBranchesPeopleCounter += branch.people;
            });
        } else {
            ///////////////////////////
            // People counter
            //////////////////////////
            // People have to be calculated by previous nodes on all tracks
            const branchTrackIds = getBranchTrackIds(trackNode);

            const branchPeopleOnSegment: { segmentId: string; people: number; trackIds: string[] }[] = [];
            Object.entries(branchTrackIds).forEach(([segId, trackIds]) => {
                if (trackIds) {
                    const people = branchNumbers[getBranchId(trackIds)] ?? 0;
                    branchPeopleOnSegment.push({ segmentId: segId, people, trackIds });
                }
            });

            let previousBranchesPeopleCounter = 0;
            const sortedBranches = branchPeopleOnSegment.sort((a, b) => (a.people < b.people ? 1 : -1));
            sortedBranches.forEach((branch) => {
                branch.trackIds.forEach((trackId) => {
                    trackDelays = setDelay(
                        trackDelays,
                        trackId,
                        segmentId,
                        PEOPLE,
                        previousBranchesPeopleCounter * delayPerPerson
                    );
                });
                previousBranchesPeopleCounter += branch.people;
            });
        }
    });

    return trackDelays;
};

export const getDelaysOfTracksSelector = createSelector(
    [getTrackCompositions, getParticipantsDelay, getNodeSpecifications],
    getDelaysOfTracks
);
