import { TrackStreetInfo } from '../logic/resolving/types.ts';
import { CalculatedTrack, GpxSegment } from '../../common/types.ts';
import { Sections } from '../layout/types.ts';

export interface GpxSegmentsState {
    segments: GpxSegment[];
    segmentFilterTerm?: string;
    segmentSpeeds?: Record<string, number | undefined>;
    constructionSegments?: GpxSegment[];
}

export interface CalculatedTracksState {
    tracks: CalculatedTrack[];
}

export interface LayoutState {
    selectedSection: Sections;
}

export interface TrackComposition {
    id: string;
    name?: string;
    segmentIds: string[];
    peopleCount?: number;
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
    filterTerm?: string;
    arrivalDateTime?: string;
    planningLabel?: string;
    participantDelay: number;
    averageSpeedInKmH?: number;
    segmentIdClipboard?: string[];
}

export interface MapState {
    currentTime: number;
    start?: string;
    end?: string;
    centerPoint?: { lat: number; lng: number; zoom: number };
    showMapMarker?: boolean;
    showBlockStreets?: boolean;
    showCalculatedTracks?: boolean;
    showGpxSegments?: boolean;
    showConstructions?: boolean;
}

export interface State {
    layout: LayoutState;
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
