import { SimpleGPX } from './gpxutils.ts';
import GpxParser from 'gpxparser';

export function letTimeInGpxEndAt(parsedGpx: string, endTime: string): string {
    const gpx = new GpxParser();
    gpx.parse(parsedGpx);
    const simple_gpx = new SimpleGPX([gpx]);
    simple_gpx.shiftToArrivalTime(new Date(endTime));
    return simple_gpx.toString();
}
