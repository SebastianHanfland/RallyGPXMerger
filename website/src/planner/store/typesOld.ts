export enum TrackWayPointType {
    Track = 'TRACK',
    Break = 'BREAK',
    Node = 'NODE',
}

export interface TrackWayPoint {
    streetName: string | null;
    frontArrival: string;
    frontPassage: string;
    backArrival: string;
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
    postCode?: number;
    district?: string;
    distanceInKm?: number;
    speed?: number;
    type?: TrackWayPointType;
    breakLength?: number;
    nodeTracks?: string[];
}

export interface TrackStreetInfo {
    id: string;
    name: string;
    startFront: string;
    publicStart?: string;
    arrivalBack: string;
    arrivalFront: string;
    distanceInKm: number;
    wayPoints: TrackWayPoint[];
    peopleCount?: number;
}

export interface ReplacementWayPoint {
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
}

export interface StreetNameReplacementWayPoint extends ReplacementWayPoint {
    streetName: string;
}

export interface DistrictReplacementWayPoint extends ReplacementWayPoint {
    district: string;
}

export type Point = {
    lat: number;
    lon: number;
    ele: number;
    time: string;
    extensions?: {};
};

export interface GpxFile {
    id: string;
    filename: string;
    content: string;
}

export interface GpxSegment extends GpxFile {
    flipped?: boolean;
    streetsResolved?: boolean;
}

export interface CalculatedTrack extends GpxFile {
    peopleCount?: number;
}

export interface ParsedTrack {
    id: string;
    filename: string;
    points: Point[];
    version: string;
    color?: string;
    peopleCount?: number;
}

export type Sections = 'menu' | 'gps' | 'wizard-complexity';
export type SupportedLanguages = 'de' | 'en';

export interface ClickOnSegment {
    lat: number;
    lng: number;
    segmentId: string;
}

export interface GpxSegmentsState {
    segments: GpxSegment[];
    segmentFilterTerm?: string;
    segmentSpeeds?: Record<string, number | undefined>;
    constructionSegments?: GpxSegment[];
    replaceProcess?: { targetSegment: string; replacementSegments: GpxSegment[] };
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
    resolvedPositions?: ResolvedPositions;
    resolvedPostCodes?: ResolvedPostCodes;
    resolvedDistricts?: ResolvedDistricts;
    streetReplacementWayPoints?: StreetNameReplacementWayPoint[];
    districtReplacementWayPoints?: DistrictReplacementWayPoint[];
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
}

export interface PointsState {
    points: PointOfInterest[];
    contextMenuPoint?: { lat: number; lng: number };
    editPointOfInterest?: PointOfInterest;
}

export interface StateOld {
    layout: LayoutState;
    backend?: BackendState;
    gpxSegments: GpxSegmentsState;
    trackMerge: TrackMergeState;
    calculatedTracks: CalculatedTracksState;
    map: MapState;
    points: PointsState;
    geoCoding: GeoCodingState;
    geoCodingRequests: GeoCodingRequestsState;
    toasts?: ToastsState;
    parsedTracks: ParsedTrackState | undefined;
}

export type ResolvedPositions = Record<string, string | null>;
export type ResolvedPostCodes = Record<string, number>;
export type ResolvedDistricts = Record<string, string>;
