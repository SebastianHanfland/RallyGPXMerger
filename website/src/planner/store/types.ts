import { DistrictReplacementWayPoint, StreetNameReplacementWayPoint } from '../logic/resolving/types.ts';
import { CalculatedTrack } from '../../common/types.ts';
import { Sections } from '../layout/types.ts';
import { SupportedLanguages } from '../../language.ts';

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

export const SEGMENT = 'SEGMENT' as const;
export const BREAK = 'BREAK' as const;
export const NODE = 'NODE' as const;

export type TrackElementType = typeof SEGMENT | typeof BREAK | typeof NODE;

interface TrackElementBase {
    id: string;
    type: TrackElementType;
}

export interface TrackSegment extends TrackElementBase {
    segmentId: string;
    type: typeof SEGMENT;
}

export interface TrackBreak extends TrackElementBase {
    minutes: number;
    type: typeof BREAK;
}

export interface TrackNode extends TrackElementBase {
    nodeId: string;
    type: typeof NODE;
}

export type TrackElement = TrackSegment | TrackBreak | TrackNode;

export interface TrackComposition {
    id: string;
    name?: string;
    segments: TrackElement[];
    peopleCount?: number;
    priority?: number;
    buffer?: number;
    rounding?: number;
    delayAtEndInSeconds?: number;
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
    segmentIdClipboard?: TrackElement[];
    trackIdForAddingABreak?: string;
}

export interface MapState {
    currentTime: number;
    showMapMarker?: boolean;
    showBlockStreets?: boolean;
    showCalculatedTracks?: boolean;
    showGpxSegments?: boolean;
    showConstructions?: boolean;
    showPointsOfInterest?: boolean;
    highlightedSegmentId?: string;
}

export interface TrackPause {
    minutes: number;
    description: string;
    hasToilet: boolean;
}

export interface PointsState {
    points: PointOfInterest[];
    contextMenuPoint?: { lat: number; lng: number };
    editPointOfInterest?: PointOfInterest;
}

export interface ClickOnSegment {
    lat: number;
    lng: number;
    segmentId: string;
}

export interface ParsedPoint {
    l: number; // longitude
    b: number; // latitude
    e: number; // elevation
    t: number; // time in seconds from start of segment
    s: number; // index of street resolving
}

export interface TimedPoint {
    l: number; // longitude
    b: number; // latitude
    e: number; // elevation
    t: string; // Date time in isoformat
    s: number; // index of street resolving
}

export interface ParsedGpxSegment {
    flipped?: boolean;
    streetsResolved: boolean;
    id: string;
    filename: string;
    color?: string;
    points: ParsedPoint[];
}

export interface SegmentDataState {
    segments: ParsedGpxSegment[];
    segmentFilterTerm?: string;
    pois: PointOfInterest[];
    segmentSpeeds: Record<string, number | undefined>;
    constructionSegments: ParsedGpxSegment[];
    replaceProcess?: { targetSegment: string; replacementSegments: ParsedGpxSegment[] };
    clickOnSegment?: ClickOnSegment;
    streetLookup: Record<number, string | null>;
    postCodeLookup: Record<number, string | null>;
    districtLookup: Record<number, string | null>;
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

export interface State {
    layout: LayoutState;
    backend?: BackendState;
    segmentData: SegmentDataState;
    trackMerge: TrackMergeState;
    map: MapState;
    points: PointsState;
    geoCoding: GeoCodingState;
    toasts?: ToastsState;
}

export type ResolvedPositions = Record<string, string | null>;
export type ResolvedPostCodes = Record<string, number | null>;
export type ResolvedDistricts = Record<string, string | null>;
