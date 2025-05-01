import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { Point } from '../utils/gpxTypes.ts';

export interface GpxFile {
    id: string;
    filename: string;
    content: string;
}

export interface GpxSegment extends GpxFile {
    flipped?: boolean;
    streetsResolved?: boolean;
}

export interface ResolvedGpxSegment {
    id: string;
    filename: string;
    content: SimpleGPX;
    flipped?: boolean;
    streetsResolved?: boolean;
}

export interface ResolvedCalculatedTrack {
    id: string;
    filename: string;
    content: SimpleGPX;
    peopleCount?: number;
}

export interface CalculatedTrack extends GpxFile {
    peopleCount?: number;
}

export function isZipTrack(track: GpxSegment | CalculatedTrack | DisplayTrack): track is DisplayTrack {
    return (track as DisplayTrack).color !== undefined;
}

export interface DisplayTrack extends GpxFile {
    version: string;
    color?: string;
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
