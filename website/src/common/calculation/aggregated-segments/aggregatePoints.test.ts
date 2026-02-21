import { TimedPoint } from '../../../planner/store/types.ts';
import { getConnectedPointWithTheSameStreetIndex } from './aggregatePoints.ts';

function getPoint(coordinate: number, streetIndex: number): TimedPoint {
    return {
        b: 1,
        l: coordinate,
        e: 0,
        s: streetIndex,
        t: 's',
    };
}

describe('getConnectedPointWithTheSameStreetIndex', () => {
    it('should find points with same name but different index', () => {
        // given
        const points: TimedPoint[] = [getPoint(3, 1), getPoint(4, 2)];
        const streetLookUp = { 1: 'street', 2: 'street' };
        const firstPoint = getPoint(3, 1);

        // when
        const connectedPoints = getConnectedPointWithTheSameStreetIndex(points, firstPoint, streetLookUp);

        // then
        expect(connectedPoints).toEqual([getPoint(3, 1), getPoint(4, 2)]);
    });

    it('should not find points with same name when not next to each other', () => {
        // given
        const points: TimedPoint[] = [getPoint(3, 1), getPoint(4, 2), getPoint(5, 3)];
        const streetLookUp = { 1: 'street', 2: 'other', 3: 'street' };
        const firstPoint = getPoint(3, 1);

        // when
        const connectedPoints = getConnectedPointWithTheSameStreetIndex(points, firstPoint, streetLookUp);

        // then
        expect(connectedPoints).toEqual([getPoint(3, 1)]);
    });

    it('should not find points with same name when not next to each other with more', () => {
        // given
        const points: TimedPoint[] = [
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
});
