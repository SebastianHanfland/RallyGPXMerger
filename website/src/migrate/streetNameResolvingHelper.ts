import { ParsedGpxSegment } from '../planner/store/types';
import { enrichSegmentWithResolvedStreets } from '../planner/logic/resolving/streets/enrichSegmentWithResolvedStreets';
import { GeoCodingStateOld } from '../planner/store/typesOld';

export const enrichGpxSegmentsWithStreetNames = (
    parsedSegments: ParsedGpxSegment[],
    geoCoding: GeoCodingStateOld
): { segments: ParsedGpxSegment[]; streetLookUp: Record<number, string | undefined> } => {
    const segments: ParsedGpxSegment[] = [];
    let collectedStreetLookUp: Record<number, string | undefined> = {};

    parsedSegments.forEach((parsedSegment, segmentIndex) => {
        const { segment, streetLookUp } = enrichSegmentWithResolvedStreets(
            parsedSegment,
            geoCoding.resolvedPositions ?? {},
            segmentIndex * 1000
        );
        segments.push(segment);
        collectedStreetLookUp = { ...collectedStreetLookUp, ...streetLookUp };
    });
    return { segments, streetLookUp: collectedStreetLookUp };
};
