import { toKey } from '../helper/pointKeys.ts';
import { ParsedGpxSegment, ParsedPoint, ResolvedPositions } from '../../../store/types.ts';

function getHighestFound(streetLookUp: Record<number, string>, resolvedStreetName: string): [string, string] | null {
    const entriesWithSameStreetName = Object.entries(streetLookUp).filter((entry) => entry[1] === resolvedStreetName);
    if (entriesWithSameStreetName.length === 0) {
        return null;
    }
    return entriesWithSameStreetName[entriesWithSameStreetName.length - 1];
}

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
        streetsResolved: true,
        points: points,
    };
    return { segment, streetLookUp: streetLookUp };
}
