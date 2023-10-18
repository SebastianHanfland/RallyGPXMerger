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

export interface TrackComposition {
    id: string;
    name?: string;
    segments: string[];
}

export interface TrackMergeState {
    trackCompositions: TrackComposition[];
}

export interface State {
    gpxSegments: GpxSegmentsState;
    trackMerge: TrackMergeState;
    tracks?: GpxSegmentsState;
}
