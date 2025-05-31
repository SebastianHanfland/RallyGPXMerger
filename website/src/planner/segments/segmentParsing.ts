import { ParsedGpxSegment, ParsedPoint } from '../new-store/types.ts';
import { v4 as uuidv4 } from 'uuid';
import { SimpleGPX } from '../../utils/SimpleGPX.ts';

function getPoints(gpxString: string): ParsedPoint[] {
    const points = SimpleGPX.fromString(gpxString).getPoints();
    // TODO #223: resolve time and resolve streets
    return points.map((point) => ({ l: point.lon, b: point.lat, e: point.ele, s: -1, t: 0 }));
}

export async function toParsedGpxSegment(file: File): Promise<ParsedGpxSegment> {
    return file.arrayBuffer().then((buffer) => ({
        id: uuidv4(),
        filename: file.name.replace('.gpx', ''),
        flipped: false,
        streetsResolved: false,
        points: getPoints(new TextDecoder().decode(buffer)),
    }));
}
