import { ParsedGpxSegment } from '../../store/types.ts';
import { NodePosition } from '../resolving/selectors/getNodePositions.ts';

export interface GpxFileAccess {
    shiftToArrivalTime: (arrival: string) => void;
    getStart: () => string;
    toString: () => string;
}

export interface Break {
    minutes: number;
}

export function instanceOfBreak(breakOrSegment: Break | ParsedGpxSegment | NodePosition): breakOrSegment is Break {
    const minutes = (breakOrSegment as Break).minutes;
    return minutes !== undefined;
}

export function instanceOfNode(
    breakOrSegment: Break | ParsedGpxSegment | NodePosition
): breakOrSegment is NodePosition {
    const segmentIdAfter = (breakOrSegment as NodePosition).segmentIdAfter;
    return segmentIdAfter !== undefined;
}
