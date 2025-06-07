import { ParsedGpxSegment, ParsedPoint } from '../planner/new-store/types.ts';
import { SimpleGPX } from './SimpleGPX.ts';
import { Point } from './gpxTypes.ts';

function getMetadata(parsedGpxSegment: ParsedGpxSegment) {
    return {
        name: parsedGpxSegment.filename,
        time: new Date(),
        author: {
            name: 'sternfahrtplaner.de',
            link: { href: 'https://www.sternfahrtplaner.de', type: '', text: 'Sternfahrtplaner' },
            email: { id: '', domain: '' },
        },
        link: { href: '', type: '', text: '' },
        desc: parsedGpxSegment.filename,
    };
}

export function getGpxContentStringFromParsedSegment(parsedGpxSegment: ParsedGpxSegment): string {
    return new SimpleGPX(
        getMetadata(parsedGpxSegment),
        [],
        [{ name: parsedGpxSegment.filename, points: parsedGpxSegment.points.map(toGpxPoint) }],
        []
    ).toString();
}

function toGpxPoint(parsedPoint: ParsedPoint): Point {
    return { lat: parsedPoint.b, lon: parsedPoint.l, ele: parsedPoint.e, time: '' };
}
