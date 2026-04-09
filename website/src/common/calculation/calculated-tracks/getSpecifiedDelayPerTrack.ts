import {
    BREAK,
    NODE,
    NODE_SPEC,
    NodeSpecification,
    NodeSpecifications,
    PEOPLE,
    PRIORITY,
    TrackComposition,
} from '../../../planner/store/types.ts';
import { NodeAtTrack, trackNodesBySegmentSize } from '../nodes/nodeFinder.ts';
import { getBranchId, getBranchNumbers, getBranchTrackIds } from './nodeSpecResultingBranchSize.ts';
import { getBranchPriorities } from './getBranchPriorities.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getTrackCompositions } from '../../../planner/store/trackMerge.reducer.ts';
import { getParticipantsDelay } from '../../../planner/store/settings.reducer.ts';
import { getNodeSpecifications } from '../../../planner/store/nodes.reducer.ts';

type DelayType = typeof BREAK | typeof NODE | typeof NODE_SPEC | typeof PRIORITY | typeof PEOPLE;

export interface TrackDelay {
    segmentId: string;
    extraDelay: number;
    by: DelayType;
}

export interface TrackDelayDetails {
    trackId: string;
    delays: TrackDelay[];
}

const initializeTrackDelayDetails = (trackNodes: NodeAtTrack[]) => (track: TrackComposition) => {
    const delays: TrackDelay[] = [];
    track.segments.forEach((segment) => {
        const foundNode = trackNodes.find((node) => node.segmentIdAfterNode === segment.id);
        if (foundNode) {
            delays.push({ segmentId: segment.id, by: NODE, extraDelay: -Infinity });
        }
        if (segment.type === BREAK) {
            delays.push({ segmentId: segment.id, by: BREAK, extraDelay: segment.minutes * 60 });
        }
    });
    return { trackId: track.id, delays };
};

function setDelay(
    trackDelays: TrackDelayDetails[],
    trackId: string,
    segmentId: string,
    by: DelayType,
    extraDelay: number
) {
    return [...trackDelays].map((trackDelay) => {
        if (trackId !== trackDelay.trackId) {
            return trackDelay;
        }
        const updatedDelays = trackDelay.delays.map((delay) => {
            if (delay.segmentId !== segmentId) {
                return delay;
            }
            return { segmentId, by, extraDelay };
        });
        return { trackId, delays: updatedDelays };
    });
}

function hasPrioritiesSet(priorityCounter: Record<string, number | undefined>): boolean {
    return Object.values(priorityCounter).some((counter) => (counter ?? 0) > 0);
}

const getPossibleNodeSpecification = (
    nodeSpecifications: NodeSpecifications | undefined,
    segmentIdAfter: string
): NodeSpecification | undefined => {
    if (!nodeSpecifications) {
        return undefined;
    }
    return nodeSpecifications[segmentIdAfter];
};

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
            Object.entries(foundNodeSpec.trackOffsets).forEach(([segId, offset]) => {
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
