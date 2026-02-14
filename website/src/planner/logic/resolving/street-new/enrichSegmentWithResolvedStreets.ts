import { toKey } from '../helper/pointKeys.ts';
import { ParsedGpxSegment, ResolvedPositions } from '../../../store/types.ts';

export function enrichSegmentWithResolvedStreets(
    segmentWithoutStreets: ParsedGpxSegment,
    allResolvedStreetNames: ResolvedPositions,
    streetResolveStart: number
): { segment: ParsedGpxSegment; streetLookUp: Record<number, string> } {
    let indexCounter = streetResolveStart;
    const streetLookUp: Record<number, string> = {};

    const segment = {
        ...segmentWithoutStreets,
        streetsResolved: true,
        points: segmentWithoutStreets.points.map((point) => {
            const key = toKey({ lat: point.b, lon: point.l });
            const resolvedStreetName = allResolvedStreetNames[key];
            if (!resolvedStreetName) {
                return point;
            }
            const foundInLookup = Object.entries(streetLookUp).find((entry) => entry[1] === resolvedStreetName);
            if (foundInLookup) {
                return { ...point, s: Number(foundInLookup[0]) };
            } else {
                indexCounter += 1;
                streetLookUp[indexCounter] = resolvedStreetName;
                return { ...point, s: indexCounter };
            }
        }),
    };
    return { segment, streetLookUp: streetLookUp };
}
