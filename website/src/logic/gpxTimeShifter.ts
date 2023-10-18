import GpxParser from 'gpxparser';

export function letTimeInGpxEndAt(parsedGpx: GpxParser, endTime: Date): GpxParser {
    console.log(parsedGpx, endTime);
    return parsedGpx;
}
