import { calculateSpeed, generateTimeData } from '../speedSimulator.ts';
import { Point } from 'gpxparser';

describe('speedSimulator', () => {
    it('should map an empty point list into an empty point list', () => {
        // when
        const points = generateTimeData('2020-02-02T20:20:20.000Z', 12, []);

        // then
        expect(points).toEqual([]);
    });

    function stringifyDate(point: Point) {
        return { ...point, time: point.time.toISOString() };
    }

    it('should set the first time stamp to the start value', () => {
        // when
        const points = generateTimeData('2020-02-02T20:20:20.000Z', 12, [{ lat: 1, lon: 1, ele: 1 }]);

        // then
        expect(points.map(stringifyDate)).toEqual([{ lat: 1, lon: 1, ele: 1, time: '2020-02-02T20:20:20.000Z' }]);
    });

    it('should set second timestamp', () => {
        // when
        const points = generateTimeData('2020-02-02T20:20:20.000Z', 12, [
            { lat: 1, lon: 1, ele: 1 },
            { lat: 1, lon: 1.0001, ele: 1 },
        ]);

        // then
        expect(points.map(stringifyDate)).toEqual([
            { lat: 1, lon: 1, ele: 1, time: '2020-02-02T20:20:20.000Z' },
            { lat: 1, lon: 1.0001, ele: 1, time: '2020-02-02T20:20:23.335Z' },
        ]);
        expect(calculateSpeed(points).toFixed(2)).toEqual('12.00');
    });

    it('should take elevation into account', () => {
        // when
        const points = generateTimeData('2020-02-02T20:20:20.000Z', 12, [
            { lat: 1, lon: 1, ele: 1 },
            { lat: 1, lon: 1.0001, ele: 3 },
            { lat: 1, lon: 1.0002, ele: 5 },
        ]);

        // then
        expect(points.map(stringifyDate)).toEqual([
            { lat: 1, lon: 1, ele: 1, time: '2020-02-02T20:20:20.000Z' },
            { lat: 1, lon: 1.0001, ele: 3, time: '2020-02-02T20:20:23.834Z' },
            { lat: 1, lon: 1.0002, ele: 5, time: '2020-02-02T20:20:28.228Z' },
        ]);

        expect(calculateSpeed(points)).toEqual(9.728079453213535);
    });

    it('should keep the average speed when multiple points exist and no elevation changes', () => {
        // when
        const points = generateTimeData('2020-02-02T20:20:20.000Z', 12, [
            { lat: 1, lon: 1, ele: 1 },
            { lat: 1, lon: 1.0001, ele: 1 },
            { lat: 1, lon: 1.0002, ele: 1 },
            { lat: 1.0001, lon: 1.0002, ele: 1 },
            { lat: 1.0002, lon: 1.0002, ele: 1 },
            { lat: 1.0003, lon: 1.0003, ele: 1 },
        ]);

        expect(calculateSpeed(points).toFixed(2)).toEqual('12.00');
    });
});
