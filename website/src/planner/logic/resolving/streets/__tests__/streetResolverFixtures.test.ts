import { SimpleGPX } from '../../../../../utils/SimpleGPX.ts';
import { mapToPositionMap } from '../mapToPositionMap.ts';
import { enrichSegmentWithResolvedStreets } from '../enrichSegmentWithResolvedStreets.ts';
import { ParsedGpxSegment } from '../../../../store/types.ts';
import { GeoApifyMapMatchingResult } from '../../types.ts';
import routeGpx from './fixtures/example-street-transition/route.gpx?raw';
import geoApifyResponse from './fixtures/example-street-transition/geoapify-response.json';
import expectedStreets from './fixtures/example-street-transition/expected-streets.ts';
import unmatchedMiddleRouteGpx from './fixtures/example-unmatched-middle/route.gpx?raw';
import unmatchedMiddleGeoApifyResponse from './fixtures/example-unmatched-middle/geoapify-response.json';
import unmatchedMiddleExpectedStreets from './fixtures/example-unmatched-middle/expected-streets.ts';

function toParsedSegment(rawGpx: string): ParsedGpxSegment {
    const parsed = SimpleGPX.fromString(rawGpx);
    const points = parsed.tracks[0]?.points ?? [];
    const startTime = points.length > 0 ? new Date(points[0].time).getTime() : 0;

    return {
        id: 'street-resolver-fixture',
        filename: 'street-resolver-fixture',
        points: points.map((point, index) => ({
            l: Number(point.lon),
            b: Number(point.lat),
            e: Number(point.ele),
            t: (new Date(point.time).getTime() - startTime) / 1000,
            s: index,
        })),
    };
}

describe('street resolver fixtures', () => {
    function assertFixture(rawGpx: string, response: unknown, expectedStreets: typeof unmatchedMiddleExpectedStreets) {
        const segment = toParsedSegment(rawGpx);
        const resolvedPositions = mapToPositionMap(response as GeoApifyMapMatchingResult);
        const { segment: resolvedSegment, streetLookUp } = enrichSegmentWithResolvedStreets(
            segment,
            resolvedPositions,
            0
        );

        expect(resolvedSegment.points).toHaveLength(expectedStreets.length);
        expectedStreets.forEach((expected, index) => {
            const actualPoint = resolvedSegment.points[index]!;
            const actualStreet = streetLookUp[actualPoint.s] ?? null;

            expect(actualPoint.b).toBeCloseTo(expected.lat, 6);
            expect(actualPoint.l).toBeCloseTo(expected.lon, 6);
            expect(actualStreet).toBe(expected.streetName);
        });
    }

    it('matches the expected names for example-street-transition', () => {
        assertFixture(routeGpx, geoApifyResponse, expectedStreets);
    });

    it('keeps the preceding street for an unmatched middle point', () => {
        assertFixture(unmatchedMiddleRouteGpx, unmatchedMiddleGeoApifyResponse, unmatchedMiddleExpectedStreets);
    });
});
