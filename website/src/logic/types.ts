import { CalculatedTrack, GpxSegment, TrackComposition } from '../store/types.ts';

export interface GpxMergeLogic {
    (gpxSegments: GpxSegment[], trackCompositions: TrackComposition[], arrivalDateTime: string): CalculatedTrack[];
}

export interface GpxFileAccess {
    shiftToArrivalTime: (arrival: string) => void;
    getStart: () => string;
    toString: () => string;
}

export interface Break {
    minutes: number;
}

export function instanceOfBreak(object: any): object is Break {
    return 'minutes' in object && typeof object.minutes === 'number' && Object.keys(object).length == 1;
}

export const BREAK_IDENTIFIER = '%%min-%%';
