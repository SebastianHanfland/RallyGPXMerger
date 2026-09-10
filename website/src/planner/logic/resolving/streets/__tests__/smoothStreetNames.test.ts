import { ParsedPoint } from '../../../../store/types.ts';
import { smoothStreetNames } from '../smoothStreetNames.ts';
import { getStreetLookupIndex } from '../../helper/getStreetLookupIndex.ts';

function getPoint(coordinate: number, streetIndex: number): ParsedPoint {
    return {
        b: 1,
        l: coordinate,
        e: 0,
        s: streetIndex,
        t: -1,
    };
}

function getRawPoint(coordinate: number, rawStreetIndex: number): ParsedPoint {
    return { ...getPoint(coordinate, rawStreetIndex), r: rawStreetIndex };
}

describe('smoothStreetNames', () => {
    it('uses the manual index when deciding whether a point is a junction', () => {
        const points: ParsedPoint[] = [
            { ...getPoint(1, 1), m: 3 },
            { ...getPoint(2, 2), m: 3 },
            { ...getPoint(3, 3), m: 3 },
        ];

        const smoothedPoints = smoothStreetNames(points, { 2: 'junction', 3: 'street' });

        expect(smoothedPoints.map(getStreetLookupIndex)).toEqual([3, 3, 3]);
        expect(smoothedPoints.map((point) => point.m)).toEqual([3, 3, 3]);
    });

    it('replace a single element at the start with the following', () => {
        // given
        const points: ParsedPoint[] = [getPoint(3, 1), getPoint(4, 2)];
        const streetLookUp = { 1: 'street 1', 2: 'junction', 3: 'street 2' };

        // when
        const smoothedPoints = smoothStreetNames(points, streetLookUp);

        // then
        expect(smoothedPoints).toEqual([getPoint(3, 2), getPoint(4, 2)]);
    });

    it('replace a single element at the ed with the previous', () => {
        // given
        const points: ParsedPoint[] = [getPoint(2, 1), getPoint(3, 1), getPoint(4, 2)];
        const streetLookUp = { 1: 'street 1', 2: 'junction', 3: 'street 2' };

        // when
        const smoothedPoints = smoothStreetNames(points, streetLookUp);

        // then
        expect(smoothedPoints).toEqual([getPoint(2, 1), getPoint(3, 1), getPoint(4, 1)]);
    });

    it('should smooth out a junction', () => {
        // given
        const points: ParsedPoint[] = [getPoint(2, 1), getPoint(3, 1), getPoint(4, 2), getPoint(5, 3), getPoint(6, 3)];
        const streetLookUp = { 1: 'street 1', 2: 'junction', 3: 'street 2' };

        // when
        const smoothedPoints = smoothStreetNames(points, streetLookUp);

        // then
        expect(smoothedPoints).toEqual([
            getPoint(2, 1),
            getPoint(3, 1),
            getPoint(4, 1),
            getPoint(5, 3),
            getPoint(6, 3),
        ]);
    });

    it('should smooth out a junction', () => {
        // given
        const points: ParsedPoint[] = [
            getPoint(1, 1),
            getPoint(2, 1),
            getPoint(3, 1),
            getPoint(4, 2),
            getPoint(5, 3),
            getPoint(6, 3),
            getPoint(7, 3),
        ];
        const streetLookUp = { 1: 'street', 2: 'junction', 3: 'street' };

        // when
        const smoothedPoints = smoothStreetNames(points, streetLookUp);

        // then
        expect(smoothedPoints).toEqual([1, 2, 3, 4, 5, 6, 7].map((coordinate) => getPoint(coordinate, 1)));
    });

    it('uses a new lookup entry for the common name of separate raw street groups', () => {
        const points = [getRawPoint(1, 1), getRawPoint(2, 2)];
        const streetLookUp = { 1: 'Street A, ABC1', 2: 'Street B, ABC1' };

        const smoothedPoints = smoothStreetNames(points, streetLookUp);

        expect(smoothedPoints.map((point) => point.s)).toEqual([3, 3]);
        expect(streetLookUp).toEqual({ 1: 'Street A, ABC1', 2: 'Street B, ABC1', 3: 'ABC1' });
    });

    it('extends the common lookup entry across consecutive raw street groups', () => {
        const points = [getRawPoint(1, 1), getRawPoint(2, 1), getRawPoint(3, 2), getRawPoint(4, 3)];
        const streetLookUp: Record<number, string | undefined> = {
            1: 'Street A, ABC1',
            2: 'Street B, ABC1',
            3: 'Street C, ABC1',
        };

        const smoothedPoints = smoothStreetNames(points, streetLookUp);

        expect(smoothedPoints.map((point) => point.s)).toEqual([4, 4, 4, 4]);
        expect(streetLookUp[4]).toBe('ABC1');
    });
});
