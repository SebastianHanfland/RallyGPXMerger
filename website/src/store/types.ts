import { TrackStreetInfo } from '../mapMatching/types.ts';

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
    trackParticipants: number[];
}

export interface TrackComposition {
    id: string;
    name?: string;
    segmentIds: string[];
}

export interface GeoCodingState {
    geoApifyKey?: string;
    bigDataCloudKey?: string;
    resolvedPositions?: ResolvedPositions;
    resolvedPostCodes?: ResolvedPostCodes;
    resolvedDistricts?: ResolvedDistricts;
    trackStreetInfos?: TrackStreetInfo[];
    onlyShowUnknown?: boolean;
}

export interface GeoCodingRequestsState {
    requestCounter: number;
    postCodeRequestCounter: number;
    requestDoneCounter: number;
    postCodeRequestDoneCounter: number;
    numberOfRequiredRequests?: number;
    isLoadingData: boolean;
}

export interface TrackMergeState {
    trackCompositions: TrackComposition[];
    arrivalDateTime?: string;
    participantDelay: number;
    averageSpeedInKmH?: number;
    segmentIdClipboard?: string[];
}

export const MAX_SLIDER_TIME = 100000;

export interface MapState {
    currentTime: number;
    currentSource: 'segments' | 'tracks' | 'blocked streets';
    start?: string;
    end?: string;
    centerPoint?: { lat: number; lng: number; zoom: number };
    showMapMarker?: boolean;
}

export interface State {
    gpxSegments: GpxSegmentsState;
    trackMerge: TrackMergeState;
    calculatedTracks: CalculatedTracksState;
    map: MapState;
    geoCoding: GeoCodingState;
    geoCodingRequests: GeoCodingRequestsState;
}

export type ResolvedPositions = Record<string, string | null>;
export type ResolvedPostCodes = Record<string, number>;
export type ResolvedDistricts = Record<string, string>;
