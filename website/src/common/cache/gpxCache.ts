import { CalculatedTrack, GpxSegment } from '../types.ts';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';

const gpxCache: Map<string, SimpleGPX> = new Map();

export function getGpx(gpxSegment: CalculatedTrack | GpxSegment) {
    if (gpxCache.has(gpxSegment.id)) {
        return gpxCache.get(gpxSegment.id)!;
    }
    const gpx = SimpleGPX.fromString(gpxSegment.content);
    gpxCache.set(gpxSegment.id, gpx);
    return gpx;
}

export function clearGpxCache() {
    gpxCache.clear();
}
