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
