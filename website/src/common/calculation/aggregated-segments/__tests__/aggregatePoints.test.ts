import { ParsedPoint } from '../../../../planner/store/types.ts';
import { aggregateStreetPointsInSegment, getConnectedPointWithTheSameStreetIndex } from '../aggregatePointsSelector.ts';

function getPoint(coordinate: number, streetIndex: number): ParsedPoint {
    return {
        b: 1,
        l: coordinate,
        e: 0,
        s: streetIndex,
        t: 0,
    };
}

describe('getConnectedPointWithTheSameStreetIndex', () => {
    it('uses the manual index before the automatic index', () => {
        const firstPoint = { ...getPoint(3, 1), m: 2 };
        const points = [firstPoint, { ...getPoint(4, 2), m: 2 }];

        expect(getConnectedPointWithTheSameStreetIndex(points, firstPoint, { 1: 'first', 2: 'manual' })).toEqual(
            points
        );
    });

    it('should find points with same name but different index', () => {
        // given
        const points: ParsedPoint[] = [getPoint(3, 1), getPoint(4, 2)];
        const streetLookUp = { 1: 'street', 2: 'street' };
        const firstPoint = getPoint(3, 1);

        // when
        const connectedPoints = getConnectedPointWithTheSameStreetIndex(points, firstPoint, streetLookUp);

        // then
        expect(connectedPoints).toEqual([getPoint(3, 1), getPoint(4, 2)]);
    });

    it('should not find points with same name when not next to each other', () => {
        // given
        const points: ParsedPoint[] = [getPoint(3, 1), getPoint(4, 2), getPoint(5, 3)];
        const streetLookUp = { 1: 'street', 2: 'other', 3: 'street' };
        const firstPoint = getPoint(3, 1);

        // when
        const connectedPoints = getConnectedPointWithTheSameStreetIndex(points, firstPoint, streetLookUp);

        // then
        expect(connectedPoints).toEqual([getPoint(3, 1)]);
    });

    it('should not find points with same name when not next to each other with more', () => {
        // given
        const points: ParsedPoint[] = [
            getPoint(2, 1),
            getPoint(3, 1),
            getPoint(4, 2),
            getPoint(5, 2),
            getPoint(6, 2),
            getPoint(7, 3),
            getPoint(8, 3),
            getPoint(9, 3),
        ];
        const streetLookUp = { 1: 'street', 2: 'other', 3: 'street' };
        const firstPoint = getPoint(2, 1);

        // when
        const connectedPoints = getConnectedPointWithTheSameStreetIndex(points, firstPoint, streetLookUp);

        // then
        expect(connectedPoints).toEqual([getPoint(2, 1), getPoint(3, 1)]);
    });

    it('does not connect an unknown edge section through a known street', () => {
        const points = [getPoint(2, 1), getPoint(3, 2), getPoint(4, 3)];
        const streetLookUp = { 2: 'known street' };

        expect(getConnectedPointWithTheSameStreetIndex(points, points[0], streetLookUp)).toEqual([points[0]]);
    });
});

describe('aggregateStreetPointsInSegment', () => {
    it('retains every GPX point belonging to the street geometry', () => {
        const points = [getPoint(3, 1), getPoint(4, 1), getPoint(5, 1)];

        const result = aggregateStreetPointsInSegment(points, { 1: 'street' });

        expect(result).toHaveLength(1);
        expect(result[0].path).toEqual(points);
        expect(result[0].pointFrom).toEqual(points[0]);
        expect(result[0].pointTo).toEqual(points[2]);
    });
});
