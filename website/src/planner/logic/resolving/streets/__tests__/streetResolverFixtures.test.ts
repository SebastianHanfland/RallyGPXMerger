import { SimpleGPX } from '../../../../../utils/SimpleGPX.ts';
import { ParsedGpxSegment } from '../../../../store/types.ts';
import { GeoApifyMapMatchingResult } from '../../types.ts';
import { enrichSegmentWithResolvedStreets } from '../enrichSegmentWithResolvedStreets.ts';
import { mapToPositionMap } from '../mapToPositionMap.ts';
import { StreetResolverTestCase } from './fixtureHelpers.ts';
import { exampleStreetTransitionTestCase } from './fixtures/example-street-transition/testcase.ts';
import { exampleUnmatchedMiddleTestCase } from './fixtures/example-unmatched-middle/testcase.ts';
import { evaluateDistanceOfResolving } from './fixtures/evaluate-distance-of-resolving/testcase.ts';

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
    function assertFixture(testCase: StreetResolverTestCase) {
        const segment = toParsedSegment(testCase.routeGpx);
        const resolvedPositions = mapToPositionMap(testCase.geoApifyResponse as GeoApifyMapMatchingResult);
        const { segment: resolvedSegment, streetLookUp } = enrichSegmentWithResolvedStreets(
            segment,
            resolvedPositions,
            0
        );

        const actualStreets = resolvedSegment.points.map((point) => ({
            lat: point.b,
            lon: point.l,
            streetName: streetLookUp[point.s] ?? null,
        }));

        expect(actualStreets).toEqual(testCase.expectedStreets);
    }

    const testCases = [evaluateDistanceOfResolving, exampleUnmatchedMiddleTestCase, exampleStreetTransitionTestCase];
    testCases.forEach((testCase) => {
        it(`matches the expected names for ${testCase.name}`, () => {
            assertFixture(testCase);
        });
    });
});
