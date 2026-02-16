import { ParsedGpxSegment } from '../../store/types.ts';

export interface GpxFileAccess {
    shiftToArrivalTime: (arrival: string) => void;
    getStart: () => string;
    toString: () => string;
}

export interface Break {
    minutes: number;
}

export function instanceOfBreak(breakOrSegment: Break | ParsedGpxSegment): breakOrSegment is Break {
    const minutes = (breakOrSegment as Break).minutes;
    return minutes !== undefined;
}
