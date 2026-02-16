import { toKey } from '../helper/pointKeys.ts';
import { ParsedGpxSegment, ParsedPoint, ResolvedPositions } from '../../../store/types.ts';

export function enrichSegmentWithResolvedStreets(
    segmentWithoutStreets: ParsedGpxSegment,
    allResolvedStreetNames: ResolvedPositions,
    streetResolveStart: number
): { segment: ParsedGpxSegment; streetLookUp: Record<number, string> } {
    let indexCounter = streetResolveStart;
    const streetLookUp: Record<number, string> = {};

    const points: ParsedPoint[] = [];
    segmentWithoutStreets.points.forEach((point) => {
        const key = toKey({ lat: point.b, lon: point.l });
        const resolvedStreetName = allResolvedStreetNames[key];
        if (!resolvedStreetName) {
            points.push(point);
            return;
        }
        const foundInLookup = Object.entries(streetLookUp).find((entry) => entry[1] === resolvedStreetName);
        if (foundInLookup) {
            points.push({ ...point, s: Number(foundInLookup[0]) });
            return;
        } else {
            indexCounter += 1;
            streetLookUp[indexCounter] = resolvedStreetName;
            points.push({ ...point, s: indexCounter });
            return;
        }
    });

    const segment = {
        ...segmentWithoutStreets,
        streetsResolved: true,
        points: points,
    };
    return { segment, streetLookUp: streetLookUp };
}
