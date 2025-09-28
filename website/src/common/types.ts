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

export interface CalculatedTrack {
    id: string;
    filename: string;
    peopleCount?: number;
    points: TimedPoint[];
    color?: string;
    version?: string;
}

export interface DisplayTrack {
    id: string;
    filename: string;
    peopleCount?: number;
    points: TimedPoint[];
    color?: string;
    version: string;
}
