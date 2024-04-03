import { TrackStreetInfo } from '../logic/resolving/types.ts';
import { CalculatedTrack, GpxSegment } from '../../common/types.ts';
import { Sections } from '../layout/types.ts';
import { SupportedLanguages } from '../../language.ts';

export interface GpxSegmentsState {
    segments: GpxSegment[];
    segmentFilterTerm?: string;
    segmentSpeeds?: Record<string, number | undefined>;
    constructionSegments?: GpxSegment[];
    replaceProcess?: { targetSegment: string; replacementSegments: GpxSegment[] };
}

export interface CalculatedTracksState {
    tracks: CalculatedTrack[];
}

export interface LayoutState {
    selectedSection: Sections;
    showDashboard: boolean;
    language: SupportedLanguages;
}

export interface TrackComposition {
    id: string;
    name?: string;
    segmentIds: string[];
    peopleCount?: number;
    priority?: number;
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
    isAggregating: boolean;
    isLoadingPostCodeData: boolean;
    isLoadingStreetData: boolean;
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
    showPointsOfInterest?: boolean;
    highlightedSegmentId?: string;
}

export interface PointOfInterest {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description: string;
    type: PointOfInterestType;
    radiusInM: number;
}

export enum PointOfInterestType {
    TOILET = 'TOILET',
    IMPEDIMENT = 'IMPEDIMENT',
    GATHERING = 'GATHERING',
    COMMENT = 'COMMENT',
    GAP = 'GAP',
    OTHER = 'OTHER',
}

export interface PointsState {
    points: PointOfInterest[];
    contextMenuPoint?: { lat: number; lng: number };
    editPointOfInterest?: PointOfInterest;
}

export interface State {
    layout: LayoutState;
    gpxSegments: GpxSegmentsState;
    trackMerge: TrackMergeState;
    calculatedTracks: CalculatedTracksState;
    map: MapState;
    points: PointsState;
    geoCoding: GeoCodingState;
    geoCodingRequests: GeoCodingRequestsState;
}

export type ResolvedPositions = Record<string, string | null>;
export type ResolvedPostCodes = Record<string, number>;
export type ResolvedDistricts = Record<string, string>;
