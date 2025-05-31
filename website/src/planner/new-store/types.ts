import { DistrictReplacementWayPoint, StreetNameReplacementWayPoint } from '../logic/resolving/types.ts';
import { CalculatedTrack, ParsedTrack } from '../../common/types.ts';
import { Sections } from '../layout/types.ts';
import { SupportedLanguages } from '../../language.ts';

export interface ClickOnSegment {
    lat: number;
    lng: number;
    segmentId: string;
}

export interface ParsedPoint {
    l: number; // longitude
    b: number; // latitude
    t: number; // time in seconds from start of segment
    s: number; // index of street resolving
}

export interface ParsedGpxSegment {
    flipped?: boolean;
    streetsResolved: boolean;
    id: string;
    filename: string;
    points: ParsedPoint;
}

export interface SegmentDataState {
    segments: ParsedGpxSegment[];
    segmentFilterTerm?: string;
    pois: PointOfInterest[];
    segmentSpeeds: Record<string, number | undefined>;
    constructionSegments: ParsedGpxSegment[];
    replaceProcess?: { targetSegment: string; replacementSegments: ParsedGpxSegment[] };
    clickOnSegment?: ClickOnSegment;
}

export interface CalculatedTracksState {
    tracks: CalculatedTrack[];
}

export type SidebarSections = 'segments' | 'tracks' | 'documents' | 'settings' | 'simpleTrack';

export interface LayoutState {
    selectedSection: Sections;
    language: SupportedLanguages;
    hasSingleTrack: boolean;
    isSidebarOpen: boolean;
    selectedSidebarSection: SidebarSections;
}
export interface BackendState {
    planningId?: string;
    planningPassword?: string;
    isPlanningAlreadySaved: boolean;
    hasChangesSinceLastUpload?: boolean;
}

export interface Toast {
    id: string;
    title: string;
    message?: string;
    type: 'success' | 'danger' | 'info';
}

export interface ToastsState {
    toasts: Toast[];
}

export interface TrackComposition {
    id: string;
    name?: string;
    segmentIds: string[];
    peopleCount?: number;
    priority?: number;
    buffer?: number;
    rounding?: number;
}

export interface GeoCodingState {
    geoApifyKey?: string;
    bigDataCloudKey?: string;
    streetReplacementWayPoints?: StreetNameReplacementWayPoint[];
    districtReplacementWayPoints?: DistrictReplacementWayPoint[];
    onlyShowUnknown?: boolean;
}

export interface TrackMergeState {
    trackCompositions: TrackComposition[];
    filterTerm?: string;
    arrivalDateTime?: string;
    hasDefaultArrivalDate?: boolean;
    planningLabel?: string;
    planningTitle?: string;
    participantDelay: number;
    averageSpeedInKmH?: number;
    gapToleranceInKm?: number;
    segmentIdClipboard?: string[];
    trackIdForAddingABreak?: string;
    isCalculationRunning?: boolean;
    isCalculationOnTheFly?: boolean;
    changesSinceLastCalculation?: boolean;
}

export interface ParsedTrackState {
    parsedTracks: ParsedTrack[];
    parsedSegments: ParsedTrack[];
    parsedConstructionSegments: ParsedTrack[];
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
    minutes?: number;
    type: PointOfInterestType;
    radiusInM: number;
}

export interface TrackPause {
    minutes: number;
    description: string;
    hasToilet: boolean;
}

export enum PointOfInterestType {
    TOILET = 'TOILET',
    IMPEDIMENT = 'IMPEDIMENT',
    GATHERING = 'GATHERING',
    COMMENT = 'COMMENT',
    GAP = 'GAP',
    OTHER = 'OTHER',
    BREAK = 'BREAK',
    NODE = 'NODE',
}

export interface PointsState {
    points: PointOfInterest[];
    contextMenuPoint?: { lat: number; lng: number };
    editPointOfInterest?: PointOfInterest;
}

export interface State {
    layout: LayoutState;
    backend?: BackendState;
    gpxSegments: SegmentDataState;
    trackMerge: TrackMergeState;
    calculatedTracks: CalculatedTracksState;
    map: MapState;
    points: PointsState;
    geoCoding: GeoCodingState;
    toasts?: ToastsState;
    parsedTracks: ParsedTrackState | undefined;
}

export type ResolvedPositions = Record<string, string | null>;
export type ResolvedPostCodes = Record<string, number>;
export type ResolvedDistricts = Record<string, string>;
