import {
    NodeSpecification,
    NodeSpecifications,
    TrackComposition,
    BREAK,
    NODE,
    NODE_SPEC,
    PEOPLE,
    PRIORITY,
} from '../../../planner/store/types';
import { NodeAtTrack } from '../nodes/nodeFinder';

export type DelayType = typeof BREAK | typeof NODE | typeof NODE_SPEC | typeof PRIORITY | typeof PEOPLE;
export interface TrackDelay {
    segmentId: string;
    extraDelay: number;
    by: DelayType;
}
export interface TrackDelayDetails {
    trackId: string;
    delays: TrackDelay[];
}

export const initializeTrackDelayDetails =
    (trackNodes: NodeAtTrack[]) =>
    (track: TrackComposition): TrackDelayDetails => {
        const delays: TrackDelay[] = [];
        track.segments.forEach((segment) => {
            if (trackNodes.some((node) => node.segmentIdAfterNode === segment.id))
                delays.push({ segmentId: segment.id, by: NODE, extraDelay: -Infinity });
            if (segment.type === BREAK)
                delays.push({ segmentId: segment.id, by: BREAK, extraDelay: segment.minutes * 60 });
        });
        return { trackId: track.id, delays };
    };

export function setDelay(
    trackDelays: TrackDelayDetails[],
    trackId: string,
    segmentId: string,
    by: DelayType,
    extraDelay: number
) {
    return trackDelays.map((trackDelay) => {
        if (trackId !== trackDelay.trackId) {
            return trackDelay;
        }
        const updatedDelays = trackDelay.delays.map((delay) =>
            delay.segmentId === segmentId ? { segmentId, by, extraDelay } : delay
        );
        return {
            trackId,
            delays: updatedDelays,
        };
    });
}

export const hasPrioritiesSet = (priorityCounter: Record<string, number | undefined>) =>
    Object.values(priorityCounter).some((counter) => (counter ?? 0) > 0);
export const getPossibleNodeSpecification = (
    nodeSpecifications: NodeSpecifications | undefined,
    segmentIdAfter: string
): NodeSpecification | undefined => nodeSpecifications?.[segmentIdAfter];
