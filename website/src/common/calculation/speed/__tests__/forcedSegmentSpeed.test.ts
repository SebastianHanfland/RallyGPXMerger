import { ParsedPoint } from '../../../../planner/store/types.ts';
import { calculateDistanceInKm } from '../../aggregated-segments/calculateDistanceInKm.ts';
import { generateParsedPointsWithTimeInSeconds } from '../speedSimulatorTimeInSeconds.ts';
import { generateParsedPointsWithConstantSpeedInSeconds } from '../generateParsedPointsWithConstantSpeedInSeconds.ts';
import { generateParsedPointsForSegmentSpeed } from '../generateParsedPointsForSegmentSpeed.ts';

const hillyPoints: Omit<ParsedPoint, 't'>[] = [
    { l: 11.0, b: 48.0, e: 0, s: -1 },
    { l: 11.0135, b: 48.0, e: 200, s: -1 },
];

describe('forced segment speed', () => {
    it('uses distance and the given speed only, ignoring elevation', () => {
        const speed = 12;
        const timedPoints = generateParsedPointsWithConstantSpeedInSeconds(speed, hillyPoints);
        const distanceInKm = calculateDistanceInKm(hillyPoints);
        const expectedSeconds = (3600 * distanceInKm) / speed;

        expect(timedPoints[0].t).toBe(0);
        expect(timedPoints[1].t).toBeCloseTo(expectedSeconds, 1);
    });

    it('is faster uphill than terrain-adjusted timing at the same average speed', () => {
        const speed = 12;
        const constantPoints = generateParsedPointsWithConstantSpeedInSeconds(speed, hillyPoints);
        const terrainPoints = generateParsedPointsWithTimeInSeconds(speed, hillyPoints);
        const constantEnd = constantPoints[constantPoints.length - 1].t;
        const terrainEnd = terrainPoints[terrainPoints.length - 1].t;

        expect(terrainEnd).toBeGreaterThan(constantEnd);
    });

    it('selects constant timing only when the speed is forced', () => {
        const speed = 12;
        const forced = generateParsedPointsForSegmentSpeed(speed, hillyPoints, true);
        const unforced = generateParsedPointsForSegmentSpeed(speed, hillyPoints, false);

        expect(forced).toEqual(generateParsedPointsWithConstantSpeedInSeconds(speed, hillyPoints));
        expect(unforced).toEqual(generateParsedPointsWithTimeInSeconds(speed, hillyPoints));
    });
});
