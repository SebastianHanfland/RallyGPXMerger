import { v4 as uuidv4 } from 'uuid';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';
import { generateParsedPointsWithTimeInSeconds } from '../logic/calculate/speedSimulatorTimeInSeconds.ts';
import { ParsedGpxSegment, ParsedPoint } from '../store/types.ts';

export function getPointsFromGpx(gpxString: string, averageSpeed: number): ParsedPoint[] {
    const points = SimpleGPX.fromString(gpxString).getPoints();
    const parsedPoints = points.map((point) => ({ l: point.lon, b: point.lat, e: point.ele, s: -1, t: 0 }));
    return generateParsedPointsWithTimeInSeconds(averageSpeed, parsedPoints);
}

export async function toParsedGpxSegment(file: File, averageSpeed: number): Promise<ParsedGpxSegment> {
    return file.arrayBuffer().then((buffer) => {
        const gpxString = new TextDecoder().decode(buffer);
        return {
            id: uuidv4(),
            filename: file.name.replace('.gpx', ''),
            flipped: false,
            streetsResolved: false,
            points: getPointsFromGpx(gpxString, averageSpeed),
        };
    });
}
