
import { SimpleGPX } from './gpxutils.ts';
import GpxParser from 'gpxparser';

/**
 * @deprecated use SimpleGPX.shift instead
*/

/**
 * Assumptions:
 * - for trackpoints with timestamps: calculating "new" times is just a matter of adding or subtracting a delta
 * - delta is duration between desired start-time (likely end time) and recorded time of first trackpoint
 * - for trackpoints without timestamps: not implemented
 *
 * @param parsedGpx the track to join the second to
 * @param endTime this gets joined at the end of the first
 *

 */
export function letTimeInGpxEndAt(parsedGpx: string, endTime: string): string {
    const gpx = new GpxParser();
    gpx.parse(parsedGpx);
    const simple_gpx = new SimpleGPX([gpx]);
    simple_gpx.shiftToArrivalTime(new Date(endTime));
    return simple_gpx.toString();
}
