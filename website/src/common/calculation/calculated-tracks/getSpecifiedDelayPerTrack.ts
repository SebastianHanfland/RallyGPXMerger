import {
    BREAK,
    NODE,
    NODE_SPEC,
    NodeSpecifications,
    PEOPLE,
    PRIORITY,
    TrackComposition,
} from '../../../planner/store/types.ts';
import { listAllNodesOfTracks, TrackNode } from '../nodes/nodeFinder.ts';

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
            if (trackIdsAtNode.length === 2) {
                trackDelays = setDelay(trackDelays, track.id, segment.id, PEOPLE, 0);
            }
        });
    });

    console.log({ nodeSpecifications, delayPerPerson, trackNodes, trackDelays });

    return trackDelays;
};
