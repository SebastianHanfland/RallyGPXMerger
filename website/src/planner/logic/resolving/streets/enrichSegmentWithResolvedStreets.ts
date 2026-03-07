import { toKey } from '../helper/pointKeys.ts';
import { ParsedGpxSegment, ParsedPoint, ResolvedPositions } from '../../../store/types.ts';
import { smoothStreetNames } from './smoothStreetNames.ts';

function getHighestFound(
    streetLookUp: Record<number, string | undefined>,
    resolvedStreetName: string
): [string, string] | null {
    const entriesWithSameStreetName = Object.entries(streetLookUp).filter((entry) => entry[1] === resolvedStreetName);
    if (entriesWithSameStreetName.length === 0) {
        return null;
    }
    const [key, value] = entriesWithSameStreetName[entriesWithSameStreetName.length - 1];
    if (value) {
        return [key, value];
    }
    return null;
}

export function enrichSegmentWithResolvedStreets(
    segmentWithoutStreets: ParsedGpxSegment,
    allResolvedStreetNames: ResolvedPositions,
    streetResolveStart: number
): { segment: ParsedGpxSegment; streetLookUp: Record<number, string | undefined> } {
    let indexCounter = streetResolveStart;
    const streetLookUp: Record<number, string | undefined> = {};
    let streetForLastPointFound: boolean = false;

    const points: ParsedPoint[] = [];
    segmentWithoutStreets.points.forEach((point) => {
        const key = toKey({ lat: point.b, lon: point.l });
        const resolvedStreetName = allResolvedStreetNames[key];
        if (!resolvedStreetName) {
            if (!streetForLastPointFound) {
                indexCounter += 1;
                streetLookUp[indexCounter] = undefined;
                points.push({ ...point, s: indexCounter });
                streetForLastPointFound = false;
                return;
            } else {
                streetForLastPointFound = false;
                points.push({ ...point, s: indexCounter });
                return;
            }
        }
        streetForLastPointFound = true;
        const foundInLookup = getHighestFound(streetLookUp, resolvedStreetName);

        if (foundInLookup) {
            if (points.length > 0 && points[points.length - 1].s === Number(foundInLookup[0])) {
                points.push({ ...point, s: Number(foundInLookup[0]) });
                return;
            } else {
                indexCounter += 1;
                streetLookUp[indexCounter] = resolvedStreetName;
                points.push({ ...point, s: indexCounter });
                return;
            }
        } else {
            indexCounter += 1;
            streetLookUp[indexCounter] = resolvedStreetName;
            points.push({ ...point, s: indexCounter });
            return;
        }
    });

    const segment = {
        ...segmentWithoutStreets,
        points: smoothStreetNames(points, streetLookUp),
    };
    return { segment, streetLookUp: streetLookUp };
}
