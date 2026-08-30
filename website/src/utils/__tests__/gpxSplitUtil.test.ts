import { splitGpx } from '../gpxSplitUtil.ts';
import { ParsedPoint } from '../../planner/store/types.ts';

function getPoint(longitude: number, time: number): ParsedPoint {
    return { l: longitude, b: 48, e: 0, t: time, s: 0 };
}

describe('splitGpx', () => {
    it('normalizes the timestamps of both resulting segments', () => {
        const points = [getPoint(11, 10), getPoint(12, 25), getPoint(13, 45), getPoint(14, 70)];

        const [pointsBefore, pointsAfter] = splitGpx(points, { lat: 48, lng: 13 });

        expect(pointsBefore.map((point) => point.t)).toEqual([0, 15, 35]);
        expect(pointsAfter.map((point) => point.t)).toEqual([0, 25]);
    });

    it('does not mutate the input points', () => {
        const points = [getPoint(11, 10), getPoint(12, 25), getPoint(13, 45)];

        splitGpx(points, { lat: 48, lng: 13 });

        expect(points.map((point) => point.t)).toEqual([10, 25, 45]);
    });
});
