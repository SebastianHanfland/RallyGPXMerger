import { ParsedGpxSegment } from '../planner/store/types.ts';
import { generateParsedPointsForSegmentSpeed } from '../common/calculation/speed/generateParsedPointsForSegmentSpeed.ts';

export const setTimingsForSegments = (
    parsedSegments: ParsedGpxSegment[],
    segmentSpeeds: Record<string, number | undefined> | undefined,
    averageSpeed: number,
    forcedSegmentSpeeds?: Record<string, boolean | undefined>
): ParsedGpxSegment[] => {
    return parsedSegments.map((segment) => {
        const segmentSpeed = segmentSpeeds ? segmentSpeeds[segment.id] : undefined;
        const forced = (segmentSpeed ?? 0) > 0 && !!forcedSegmentSpeeds?.[segment.id];
        const pointsWithTimes = generateParsedPointsForSegmentSpeed(
            segmentSpeed ?? averageSpeed,
            segment.points,
            forced
        );
        return { ...segment, points: pointsWithTimes };
    });
};
