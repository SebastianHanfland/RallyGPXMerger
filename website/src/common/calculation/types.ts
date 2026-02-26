import { ParsedGpxSegment, TrackBreak } from '../../planner/store/types.ts';
import { NodePosition } from '../../planner/logic/resolving/selectors/getNodePositions.ts';

export interface GpxFileAccess {
    shiftToArrivalTime: (arrival: string) => void;
    getStart: () => string;
    toString: () => string;
}

export function instanceOfBreak(
    breakOrSegment: TrackBreak | ParsedGpxSegment | NodePosition
): breakOrSegment is TrackBreak {
    const minutes = (breakOrSegment as TrackBreak).minutes;
    return minutes !== undefined;
}

export function instanceOfNode(breakOrSegment: ParsedGpxSegment | NodePosition): breakOrSegment is NodePosition {
    const segmentIdAfter = (breakOrSegment as NodePosition).segmentIdAfter;
    return segmentIdAfter !== undefined;
}
