import {
    BREAK,
    NODE,
    NODE_SPEC,
    NodeSpecifications,
    PEOPLE,
    PRIORITY,
    TrackComposition,
} from '../../../planner/store/types.ts';
import { listAllNodesOfTracks } from '../nodes/nodeFinder.ts';

export interface TrackDelay {
    segmentId: string;
    extraDelay: number;
    by: typeof BREAK | typeof NODE | typeof NODE_SPEC | typeof PRIORITY | typeof PEOPLE;
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

export const getDelaysOfTracks = (
    trackCompositions: TrackComposition[],
    delayPerPerson: number,
    nodeSpecifications: NodeSpecifications | undefined
): TrackDelayDetails[] => {
    const trackNodes = listAllNodesOfTracks(trackCompositions);

    const trackDelays: TrackDelayDetails[] = trackCompositions.map((track) => {
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
    });

    console.log({ nodeSpecifications, delayPerPerson, trackNodes, trackDelays });

    return trackDelays;
};
