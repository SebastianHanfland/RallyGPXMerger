import { ParsedGpxSegment } from '../planner/store/types.ts';
import { enrichSegmentWithResolvedStreets } from '../planner/logic/resolving/street-new/enrichSegmentWithResolvedStreets.ts';
import { GeoCodingStateOld } from '../planner/store/typesOld.ts';

export const enrichGpxSegmentsWithStreetNames = (
    parsedSegments: ParsedGpxSegment[],
    geoCodingStateOld: GeoCodingStateOld
): { segments: ParsedGpxSegment[]; streetLookUp: Record<number, string> } => {
    const segments: ParsedGpxSegment[] = [];
    let collectedStreetLookUp: Record<number, string> = {};

    parsedSegments.forEach((parsedSegment, segmentIndex) => {
        const { segment, streetLookUp } = enrichSegmentWithResolvedStreets(
            parsedSegment,
            geoCodingStateOld.resolvedPositions ?? {},
            segmentIndex * 1000
        );
        segments.push(segment);
        collectedStreetLookUp = { ...collectedStreetLookUp, ...streetLookUp };
    });
    return { segments, streetLookUp: collectedStreetLookUp };
};
