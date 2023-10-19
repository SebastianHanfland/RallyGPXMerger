import { CalculatedTrack, GpxSegment, TrackComposition } from '../store/types.ts';

export interface GpxMergeLogic {
    (gpxSegments: GpxSegment[], trackCompositions: TrackComposition[], arrivalDateTime: string): CalculatedTrack[];
}
