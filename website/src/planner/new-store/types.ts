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
    streetLookup: Record<number, string>;
    postCodeLookup: Record<number, string>;
    districtLookup: Record<number, string>;
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

export type ResolvedPositions = Record<string, string | null>;
