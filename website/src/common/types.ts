import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { Point } from '../utils/gpxTypes.ts';
import { TimedPoint } from '../planner/new-store/types.ts';

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

export interface CalculatedTrack extends GpxFile {
    peopleCount?: number;
    points: TimedPoint[];
    color?: string;
    version?: string;
}

export interface DisplayTrack extends GpxFile {
    version: string;
    color?: string;
    peopleCount?: number;
    points: TimedPoint[];
}

export interface ParsedTrack {
    id: string;
    filename: string;
    points: Point[];
    version: string;
    color?: string;
    peopleCount?: number;
}
