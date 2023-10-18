export interface GpxSegment {
    id: string;
    filename: string;
    content: string;
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
}

export interface State {
    gpxSegments: GpxSegmentsState;
    trackMerge: TrackMergeState;
    calculatedTracks: CalculatedTracksState;
}
