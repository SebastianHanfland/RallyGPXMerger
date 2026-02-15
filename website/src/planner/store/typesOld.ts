enum TrackWayPointType {
    Track = 'TRACK',
    Break = 'BREAK',
    Node = 'NODE',
}

interface TrackWayPoint {
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

interface TrackStreetInfo {
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

interface ReplacementWayPoint {
    pointFrom: { lat: number; lon: number };
    pointTo: { lat: number; lon: number };
}

interface StreetNameReplacementWayPoint extends ReplacementWayPoint {
    streetName: string;
}

interface DistrictReplacementWayPoint extends ReplacementWayPoint {
    district: string;
}

type TrackPoint = {
    lat: number;
    lon: number;
    ele: number;
    time: string;
};

type SegmentPoint = {
    lat: number;
    lon: number;
    ele: number;
};

interface GpxFile {
    id: string;
    filename: string;
    content: string;
}

export interface GpxSegmentOld extends GpxFile {
    flipped?: boolean;
    streetsResolved?: boolean;
}

interface CalculatedTrack extends GpxFile {
    peopleCount?: number;
}

interface ParsedTrack {
    id: string;
    filename: string;
    points: TrackPoint[];
    version: string;
    color?: string;
    peopleCount?: number;
}

interface ParsedSegment {
    id: string;
    filename: string;
    points: SegmentPoint[];
    version: string;
    color?: string;
    peopleCount?: number;
}

type Sections = 'menu' | 'gps' | 'wizard-complexity';
type SupportedLanguages = 'de' | 'en';

interface ClickOnSegment {
    lat: number;
    lng: number;
    segmentId: string;
}

export interface GpxSegmentsStateOld {
    segments: GpxSegmentOld[];
    segmentFilterTerm?: string;
    segmentSpeeds?: Record<string, number | undefined>;
    constructionSegments?: GpxSegmentOld[];
    replaceProcess?: { targetSegment: string; replacementSegments: GpxSegmentOld[] };
    clickOnSegment?: ClickOnSegment;
}

interface CalculatedTracksState {
    tracks: CalculatedTrack[];
}

type SidebarSections = 'segments' | 'tracks' | 'documents' | 'settings' | 'simpleTrack';

interface LayoutState {
    selectedSection: Sections;
    language: SupportedLanguages;
    hasSingleTrack: boolean;
    isSidebarOpen: boolean;
    selectedSidebarSection: SidebarSections;
}
interface BackendState {
    planningId?: string;
    planningPassword?: string;
    isPlanningAlreadySaved: boolean;
    hasChangesSinceLastUpload?: boolean;
}

interface Toast {
    id: string;
    title: string;
    message?: string;
    type: 'success' | 'danger' | 'info';
}

interface ToastsState {
    toasts: Toast[];
}

interface TrackComposition {
    id: string;
    name?: string;
    segmentIds: string[];
    peopleCount?: number;
    priority?: number;
    buffer?: number;
    rounding?: number;
}

export interface GeoCodingStateOld {
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

interface GeoCodingRequestsState {
    isAggregating: boolean;
    isLoadingPostCodeData: boolean;
    isLoadingStreetData: boolean;
}

export interface TrackMergeStateOld {
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

interface ParsedTrackState {
    parsedTracks: ParsedTrack[];
    parsedSegments: ParsedSegment[];
    parsedConstructionSegments: ParsedTrack[];
}

interface MapState {
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

interface PointOfInterest {
    id: string;
    lat: number;
    lng: number;
    title: string;
    description: string;
    type: PointOfInterestType;
    radiusInM: number;
}

enum PointOfInterestType {
    TOILET = 'TOILET',
    IMPEDIMENT = 'IMPEDIMENT',
    GATHERING = 'GATHERING',
    COMMENT = 'COMMENT',
    GAP = 'GAP',
    OTHER = 'OTHER',
}

interface PointsState {
    points: PointOfInterest[];
    contextMenuPoint?: { lat: number; lng: number };
    editPointOfInterest?: PointOfInterest;
}

type ResolvedPositions = Record<string, string | null>;
type ResolvedPostCodes = Record<string, string>;
type ResolvedDistricts = Record<string, string>;

export interface StateOld {
    layout: LayoutState;
    backend?: BackendState;
    gpxSegments: GpxSegmentsStateOld;
    trackMerge: TrackMergeStateOld;
    calculatedTracks: CalculatedTracksState;
    map: MapState;
    points: PointsState;
    geoCoding: GeoCodingStateOld;
    geoCodingRequests: GeoCodingRequestsState;
    toasts?: ToastsState;
    parsedTracks: ParsedTrackState | undefined;
}
