import { ParsedGpxSegment } from '../planner/store/types';
import { generateParsedPointsWithTimeInSeconds } from '../common/calculation/speed/speedSimulatorTimeInSeconds';

export const setTimingsForSegments = (
    parsedSegments: ParsedGpxSegment[],
    segmentSpeeds: Record<string, number | undefined> | undefined,
    averageSpeed: number
): ParsedGpxSegment[] => {
    return parsedSegments.map((segment) => {
        const segmentSpeed = segmentSpeeds ? segmentSpeeds[segment.id] : undefined;
        const pointsWithTimes = generateParsedPointsWithTimeInSeconds(segmentSpeed ?? averageSpeed, segment.points);
        return { ...segment, points: pointsWithTimes };
    });
};
