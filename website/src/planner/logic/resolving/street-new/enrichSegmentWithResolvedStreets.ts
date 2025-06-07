import { ParsedGpxSegment, ResolvedPositions } from '../../../new-store/types.ts';

export function enrichSegmentWithResolvedStreets(
    segmentWithoutStreets: ParsedGpxSegment,
    allResolvedStreetNames: ResolvedPositions,
    streetResolveStart: number
): { segment: ParsedGpxSegment; streetLookUp: Record<number, string> } {
    const segment = {
        ...segmentWithoutStreets,
        streetsResolved: true,
        points: segmentWithoutStreets.points.map((point) => ({ ...point, s: streetResolveStart })),
    };
    const streetLookUp = { [streetResolveStart]: Object.values(allResolvedStreetNames)[0] ?? '' };
    return { segment, streetLookUp: streetLookUp };
}
