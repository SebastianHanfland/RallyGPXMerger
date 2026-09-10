import { toKey } from '../helper/pointKeys.ts';
import { ParsedGpxSegment, ParsedPoint, ResolvedPositions } from '../../../store/types.ts';
import { smoothStreetNames } from './smoothStreetNames.ts';
export function enrichSegmentWithResolvedStreets(
    segmentWithoutStreets: ParsedGpxSegment,
    allResolvedStreetNames: ResolvedPositions,
    streetResolveStart: number
): { segment: ParsedGpxSegment; streetLookUp: Record<number, string | undefined> } {
    let indexCounter = streetResolveStart;
    const streetLookUp: Record<number, string | undefined> = {};
    let previousStreetName: string | undefined;
    let previousWasResolved = false;

    const points: ParsedPoint[] = [];
    segmentWithoutStreets.points.forEach((point) => {
        const key = toKey({ lat: point.b, lon: point.l });
        const resolvedStreetName = allResolvedStreetNames[key] ?? undefined;
        const isResolved = resolvedStreetName !== undefined;
        const continuesPreviousRawStreet =
            isResolved && previousWasResolved && resolvedStreetName === previousStreetName;

        if (!continuesPreviousRawStreet) {
            indexCounter += 1;
            streetLookUp[indexCounter] = resolvedStreetName;
        }

        points.push({ ...point, r: indexCounter, s: indexCounter });
        previousStreetName = resolvedStreetName;
        previousWasResolved = isResolved;
    });

    const segment = {
        ...segmentWithoutStreets,
        points: smoothStreetNames(points, streetLookUp),
    };
    return { segment, streetLookUp: streetLookUp };
}
