import { describe, expect, it } from 'vitest';
import geoDistance from 'geo-distance-helper';
import { generateParsedPointsWithTimeInSeconds } from '../speedSimulatorTimeInSeconds.ts';
import { ParsedPoint } from '../../../../planner/store/types.ts';

const points = (elevations: number[]): Omit<ParsedPoint, 't'>[] =>
    elevations.map((e, index) => ({ l: 1 + index * 0.01, b: 1, e, s: -1 }));

describe('generateParsedPointsWithTimeInSeconds', () => {
    it('uses elevation-aware timing by default', () => {
        const flat = generateParsedPointsWithTimeInSeconds(20, points([0, 0]));
        const uphill = generateParsedPointsWithTimeInSeconds(20, points([0, 1000]));

        expect(uphill[1]!.t).toBeGreaterThan(flat[1]!.t);
    });

    it('uses fixed velocity timing without considering elevation', () => {
        const flat = generateParsedPointsWithTimeInSeconds(20, points([0, 0]), true);
        const uphill = generateParsedPointsWithTimeInSeconds(20, points([0, 1000]), true);
        const distanceInKm = geoDistance(
            { lat: points([0, 0])[1]!.b, lng: points([0, 0])[1]!.l },
            { lat: points([0, 0])[0]!.b, lng: points([0, 0])[0]!.l }
        ) as number;

        expect(uphill[1]!.t).toBe(flat[1]!.t);
        expect(flat[1]!.t).toBe(Number(((60 * 60 * distanceInKm) / 20).toFixed(2)));
    });
});
