import { ParsedPoint } from '../../../planner/store/types.ts';
import { generateParsedPointsWithTimeInSeconds } from './speedSimulatorTimeInSeconds.ts';
import { generateParsedPointsWithConstantSpeedInSeconds } from './generateParsedPointsWithConstantSpeedInSeconds.ts';

export function generateParsedPointsForSegmentSpeed(
    speed: number,
    points: Omit<ParsedPoint, 't'>[],
    forced?: boolean
): ParsedPoint[] {
    if (forced) {
        return generateParsedPointsWithConstantSpeedInSeconds(speed, points);
    }
    return generateParsedPointsWithTimeInSeconds(speed, points);
}
