import { ParsedGpxSegment, ResolvedPositions } from '../planner/store/types.ts';
import { enrichSegmentWithResolvedStreets } from '../planner/logic/resolving/street-new/enrichSegmentWithResolvedStreets.ts';

export const enrichGpxSegmentsWithStreetNames = (
    parsedSegments: ParsedGpxSegment[],
    resolvedPositions: ResolvedPositions,
    streetLookup: Record<number, string | null>
): { segments: ParsedGpxSegment[]; streetLookUp: Record<number, string> } => {
    const lookupKeys = Object.keys(streetLookup);
    const maximumIndex = lookupKeys.length === 0 ? 1 : Math.max(...lookupKeys.map(Number));
    const segmentIndexOffset = Math.ceil(maximumIndex / 1000);

    const segments: ParsedGpxSegment[] = [];
    let collectedStreetLookUp: Record<number, string> = {};

    parsedSegments.forEach((parsedSegment, segmentIndex) => {
        const { segment, streetLookUp } = enrichSegmentWithResolvedStreets(
            parsedSegment,
            resolvedPositions,
            (segmentIndexOffset + segmentIndex) * 1000
        );
        segments.push(segment);
        collectedStreetLookUp = { ...collectedStreetLookUp, ...streetLookUp };
    });
    return { segments, streetLookUp: collectedStreetLookUp };
};
