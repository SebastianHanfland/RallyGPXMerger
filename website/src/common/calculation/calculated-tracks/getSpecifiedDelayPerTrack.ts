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
import { TrackNode, trackNodesBySegmentSize } from '../nodes/nodeFinder.ts';
import { getBranchInfo2, getPeopleFromBranchesWithHigherPriority } from './peopleDelayCounter.ts';
import { getBranchNumbers } from './nodeSpecResultingBranchSize.ts';

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
    const trackNodes = trackNodesBySegmentSize(trackCompositions);
    const branchNumbers = getBranchNumbers(nodeSpecifications ?? {}, trackCompositions);

    let trackDelays: TrackDelayDetails[] = trackCompositions.map(initializeTrackDelayDetails(trackNodes));

    trackNodes.forEach((trackNode) => {
        const segmentId = trackNode.segmentIdAfterNode;
        const { peopleLengthOnSegment, priorityCounter } = getBranchInfo2(branchNumbers, segmentId, trackCompositions);
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
                    trackDelays = setDelay(trackDelays, track.id, segmentId, NODE_SPEC, offset);
                });
            });
        } else if (hasPrioritiesSet(priorityCounter)) {
            ///////////////////////////
            // Priority
            //////////////////////////
            const tracksWithSegment = trackCompositions.filter((track) =>
                track.segments.map((segment) => segment.id).includes(segmentId)
            );
            tracksWithSegment.forEach((track) => {
                // People have to be calculated by previous nodes
                const delayByPriority = getPeopleFromBranchesWithHigherPriority(
                    priorityCounter,
                    track.id,
                    peopleLengthOnSegment
                );
                trackDelays = setDelay(trackDelays, track.id, segmentId, PRIORITY, delayByPriority * delayPerPerson);
            });
        } else {
            ///////////////////////////
            // People counter
            //////////////////////////
            // People have to be calculated by previous nodes on all tracks
            const tracksWithSegment = trackCompositions.filter((track) =>
                track.segments.map((segment) => segment.id).includes(segmentId)
            );
            tracksWithSegment.forEach((track) => {
                let peopleOnOtherBranches = 0;
                const otherBranches: string[] = [];
                Object.entries(peopleOnOtherBranches).forEach(([branch, people]) => {
                    if (branch !== track.id) {
                        peopleOnOtherBranches += people;
                        otherBranches.push(branch);
                    }
                });
                const peopleOfBranch = peopleLengthOnSegment[track.id];

                const resultingOffset = peopleOfBranch >= peopleOnOtherBranches ? 0 : peopleOnOtherBranches;
                trackDelays = setDelay(trackDelays, track.id, segmentId, PEOPLE, resultingOffset * delayPerPerson);
            });
        }
    });

    return trackDelays;
};
