import { ParsedGpxSegment, ParsedPoint, TimedPoint } from '../planner/new-store/types.ts';
import { SimpleGPX } from './SimpleGPX.ts';
import { Point } from './gpxTypes.ts';

function getMetadata(name: string) {
    return {
        name: name,
        time: new Date(),
        author: {
            name: 'sternfahrtplaner.de',
            link: { href: 'https://www.sternfahrtplaner.de', type: '', text: 'Sternfahrtplaner' },
            email: { id: '', domain: '' },
        },
        link: { href: '', type: '', text: '' },
        desc: name,
    };
}

export function getGpxContentStringFromParsedSegment(parsedGpxSegment: ParsedGpxSegment): string {
    return new SimpleGPX(
        getMetadata(parsedGpxSegment.filename),
        [],
        [{ name: parsedGpxSegment.filename, points: parsedGpxSegment.points.map(toGpxPoint) }],
        []
    ).toString();
}

function toGpxPoint(parsedPoint: ParsedPoint): Point {
    return { lat: parsedPoint.b, lon: parsedPoint.l, ele: parsedPoint.e, time: '' };
}

export function getGpxContentFromTimedPoints(timedPoints: TimedPoint[], name: string): string {
    return new SimpleGPX(
        getMetadata(name),
        [],
        [{ name: name, points: timedPoints.map(toTimedGpxPoint) }],
        []
    ).toString();
}

function toTimedGpxPoint(timedPoint: TimedPoint): Point {
    return { lat: timedPoint.b, lon: timedPoint.l, ele: timedPoint.e, time: timedPoint.t };
}
