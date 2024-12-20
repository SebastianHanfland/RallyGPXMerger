import { SimpleGPX } from '../utils/SimpleGPX.ts';

export interface GpxFile {
    id: string;
    filename: string;
    content: string;
}

export interface ReadableTrack {
    id: string;
    gpx: SimpleGPX;
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

export function isZipTrack(track: GpxSegment | CalculatedTrack | ZipTrack): track is ZipTrack {
    return (track as ZipTrack).color !== undefined;
}

export interface ZipTrack extends GpxFile {
    version: string;
    color?: string;
    peopleCount?: number;
}
