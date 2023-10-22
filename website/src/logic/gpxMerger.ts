import { default as GpxParser } from 'gpxparser';

import { SimpleGPX } from './gpxutils.ts';

export function mergeGpxs(first: string, second: string, timeshift: number = 0): string {
    const gpx = new GpxParser();
    gpx.parse(first);
    const other = new GpxParser();
    other.parse(second);
    const simple_gpx = new SimpleGPX([gpx, other]);
    simple_gpx.shift(timeshift);
    return simple_gpx.toString();
}
