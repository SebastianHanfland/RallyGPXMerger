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
import { listAllNodesOfTracks, TrackNode } from '../nodes/nodeFinder.ts';
import { getBranchInfo, getPeopleFromBranchesWithHigherPriority } from './peopleDelayCounter.ts';

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
// export const getSpecifiedDelayPerTrack = () => {
//     const segemtIdAfterNode = '123';
//     const involvedTracks: TrackComposition[] = [];
//
//     // for each track involved
//     involvedTracks.map(() => {
//         return {
//             trackId: '1',
//             delaysBeforeSegments: [
//                 { segmentId: '23', extraDelay: 20, by: NODE },
//                 { segmentId: '23', extraDelay: 20, by: BREAK },
//                 { segmentId: '12', extraDelay: 20, by: NODE },
//                 { segmentId: '12', extraDelay: 20, by: PRIORITY },
//                 { segmentId: '12', extraDelay: 20, by: PEOPLE },
//             ],
//         };
//     });
//     // summing up delay for extra delay -> Calculation done
//     // for displaying and UI purpose
// };

const initializeTrackDelayDetails = (trackNodes: TrackNode[]) => (track: TrackComposition) => {
    const delays: TrackDelay[] = [];
    track.segments.forEach((segment) => {
        const foundNode = trackNodes.find((node) => node.segmentIdAfterNode === segment.id);
        if (foundNode) {
            delays.push({ segmentId: segment.id, by: NODE, extraDelay: -Infinity });
        }
        if (segment.type === BREAK) {
            delays.push({ segmentId: segment.id, by: BREAK, extraDelay: segment.minutes });
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

function hasPrioritiesSet(priorityCounter: Record<string, number>): boolean {
    return Object.values(priorityCounter).some((counter) => counter > 0);
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
    const trackNodes = listAllNodesOfTracks(trackCompositions);

    let trackDelays: TrackDelayDetails[] = trackCompositions.map(initializeTrackDelayDetails(trackNodes));

    trackCompositions.forEach((track) => {
        track.segments.forEach((segment) => {
            const foundNode = trackNodes.find((node) => node.segmentIdAfterNode === segment.id);
            if (!foundNode) {
                return;
            }
            const trackIdsAtNode = foundNode.segmentsBeforeNode.map((beforeNode) => beforeNode.trackId);
            const { branchOfTrack, priorityCounter, peopleCounter } = getBranchInfo(
                foundNode.segmentIdAfterNode,
                trackCompositions,
                track.id
            );
            console.log(trackIdsAtNode, 'for later for the node lookup');
            console.log({ branchOfTrack, priorityCounter, peopleCounter, bP: priorityCounter[branchOfTrack!] });

            const foundNodeSpec = getPossibleNodeSpecification(nodeSpecifications, foundNode.segmentIdAfterNode);
            if (foundNodeSpec) {
                foundNodeSpec.trackOffsets;
                const foundOffsetRecord = Object.entries(foundNodeSpec.trackOffsets).find(([segmentId]) =>
                    track.segments.map((segment) => segment.id).includes(segmentId)
                );
                if (foundOffsetRecord) {
                    const delayByNodeSpec = foundOffsetRecord[1] * delayPerPerson;
                    trackDelays = setDelay(trackDelays, track.id, segment.id, NODE_SPEC, delayByNodeSpec);
                }
            } else if (branchOfTrack && hasPrioritiesSet(priorityCounter)) {
                const delayByPriority = getPeopleFromBranchesWithHigherPriority(
                    priorityCounter,
                    branchOfTrack,
                    peopleCounter
                );
                trackDelays = setDelay(trackDelays, track.id, segment.id, PRIORITY, delayByPriority * delayPerPerson);
            } else if (branchOfTrack) {
                let peopleOnOtherBranches = 0;
                const otherBranches: string[] = [];
                Object.entries(peopleCounter).forEach(([branch, people]) => {
                    if (branch !== branchOfTrack) {
                        peopleOnOtherBranches += people;
                        otherBranches.push(branch);
                    }
                });
                const peopleOfBranch = peopleCounter[branchOfTrack];
                if (peopleOfBranch === peopleOnOtherBranches) {
                    if (otherBranches.length === 1) {
                        const resultingOffset = branchOfTrack < otherBranches[0] ? 0 : peopleOnOtherBranches;
                        trackDelays = setDelay(
                            trackDelays,
                            track.id,
                            segment.id,
                            PEOPLE,
                            resultingOffset * delayPerPerson
                        );
                    } else {
                        // TODO: 286 How to handle a merge of three branches?
                        if (otherBranches.length === 1) {
                            const resultingOffset = branchOfTrack < otherBranches[0] ? 0 : peopleOnOtherBranches;
                            trackDelays = setDelay(
                                trackDelays,
                                track.id,
                                segment.id,
                                PEOPLE,
                                resultingOffset * delayPerPerson
                            );
                        }
                    }
                } else {
                    const resultingOffset = peopleOfBranch >= peopleOnOtherBranches ? 0 : peopleOnOtherBranches;
                    trackDelays = setDelay(trackDelays, track.id, segment.id, PEOPLE, resultingOffset * delayPerPerson);
                }
            }
        });
    });

    console.log({ nodeSpecifications, delayPerPerson, trackNodes, trackDelays });

    return trackDelays;
};
