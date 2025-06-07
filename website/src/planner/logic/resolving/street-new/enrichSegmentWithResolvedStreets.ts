import { ParsedGpxSegment, ResolvedPositions } from '../../../new-store/types.ts';

export function enrichSegmentWithResolvedStreets(
    segmentWithoutStreets: ParsedGpxSegment,
    allResolvedStreetNames: ResolvedPositions,
    streetResolveStart: number
): { segment: ParsedGpxSegment; streetLookUp: Record<number, string> } {
    return { segment: { ...segmentWithoutStreets, streetsResolved: true }, streetLookUp: {} };
}
