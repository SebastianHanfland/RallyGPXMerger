import { SimpleGPX } from '../logic/gpxutils.ts';

export interface GpxSegment {
    id: string;
    filename: string;
    content: SimpleGPX;
    peopleCountStart?: number;
    peopleCountEnd?: number;
}
export interface GpxSegmentsState {
    segments: GpxSegment[];
}

export interface CalculatedTrack {
    id: string;
    filename: string;
    content: string;
}

export interface CalculatedTracksState {
    tracks: CalculatedTrack[];
}

export interface TrackComposition {
    id: string;
    name?: string;
    segmentIds: string[];
}

export interface TrackMergeState {
    trackCompositions: TrackComposition[];
    arrivalDateTime?: string;
}

export interface State {
    gpxSegments: GpxSegmentsState;
    trackMerge: TrackMergeState;
    calculatedTracks: CalculatedTracksState;
}
