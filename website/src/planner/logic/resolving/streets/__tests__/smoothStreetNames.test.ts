import { ParsedPoint } from '../../../../store/types.ts';
import { smoothStreetNames } from '../smoothStreetNames.ts';

function getPoint(coordinate: number, streetIndex: number): ParsedPoint {
    return {
        b: 1,
        l: coordinate,
        e: 0,
        s: streetIndex,
        t: -1,
    };
}

describe('smoothStreetNames', () => {
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
});
