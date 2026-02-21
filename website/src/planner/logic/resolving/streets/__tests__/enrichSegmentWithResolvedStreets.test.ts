import { enrichSegmentWithResolvedStreets } from '../enrichSegmentWithResolvedStreets.ts';
import { toKey } from '../../helper/pointKeys.ts';
import { ParsedGpxSegment } from '../../../../store/types.ts';

function createPoint(l: number, b: number) {
    return { l, b, e: 1, t: 1, s: -1 };
}

function getKey(l: number, b: number) {
    return toKey({ lat: b, lon: l });
}

describe('enrichSegmentWithResolvedStreets', () => {
    it('should keep most information on segment the same, but set the resolved flag', () => {
        // given
        const segmentWithoutStreets: ParsedGpxSegment = {
            points: [],
            filename: 'fname',
            id: '123',
            streetsResolved: false,
        };
        // when
        const { segment, streetLookUp } = enrichSegmentWithResolvedStreets(segmentWithoutStreets, {}, 1);

        // then
        expect(segment.streetsResolved).toBeTruthy();
        expect(segment.filename).toEqual(segmentWithoutStreets.filename);
        expect(segment.id).toEqual(segmentWithoutStreets.id);
        expect(segment.points.length).toEqual(segmentWithoutStreets.points.length);

        expect(streetLookUp).toEqual({});
    });

    it('should resolve the street on one point', () => {
        // given
        const segmentWithoutStreets: ParsedGpxSegment = {
            points: [createPoint(3, 2), createPoint(4, 2), createPoint(5, 2), createPoint(6, 2)],
            filename: 'fname',
            id: '123',
            streetsResolved: false,
        };
        const allResolvedStreetNames = {
            [getKey(3, 2)]: 'Main road',
            [getKey(4, 2)]: 'Main road',
            [getKey(5, 2)]: 'Small road',
            [getKey(6, 2)]: 'Small road',
        };

        // when
        const { segment, streetLookUp } = enrichSegmentWithResolvedStreets(
            segmentWithoutStreets,
            allResolvedStreetNames,
            1000
        );

        // then
        expect(segment.points.map(({ s }) => s)).toEqual([1001, 1001, 1002, 1002]);
        expect(streetLookUp).toEqual({ 1001: 'Main road', 1002: 'Small road' });
    });
});
