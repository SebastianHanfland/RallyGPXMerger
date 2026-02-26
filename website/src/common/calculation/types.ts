import { BREAK, ENTRY, ParsedGpxSegment, TrackBreak, TrackEntry } from '../../planner/store/types.ts';
import { NodePosition } from '../../planner/logic/resolving/selectors/getNodePositions.ts';

export interface GpxFileAccess {
    shiftToArrivalTime: (arrival: string) => void;
    getStart: () => string;
    toString: () => string;
}

export function instanceOfBreak(
    breakOrSegment: TrackBreak | TrackEntry | ParsedGpxSegment | NodePosition
): breakOrSegment is TrackBreak {
    return (breakOrSegment as TrackBreak).type === BREAK;
}

export function instanceOfEntry(
    breakOrSegment: TrackEntry | ParsedGpxSegment | NodePosition
): breakOrSegment is TrackEntry {
    return (breakOrSegment as TrackEntry).type === ENTRY;
}

export function instanceOfNode(breakOrSegment: ParsedGpxSegment | NodePosition): breakOrSegment is NodePosition {
    const segmentIdAfter = (breakOrSegment as NodePosition).segmentIdAfter;
    return segmentIdAfter !== undefined;
}
