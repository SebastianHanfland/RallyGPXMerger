import { CalculatedTrack, GpxSegment, TrackComposition } from '../store/types.ts';

export interface GpxMergeLogic {
    (gpxSegments: GpxSegment[], trackCompositions: TrackComposition[], arrivalDateTime: string): CalculatedTrack[];
}

export interface Break {
    minutes: number;
}

export const BREAK_IDENTIFIER = '%%min-%%';
