import { getSegmentInfo } from '../getSegmentInfo.ts';
import { AggregatedPoints } from '../../../logic/resolving/types.ts';

describe('getSegmentInfo', () => {
    it('return undefined for undefined input', () => {
        // when
        const segmentInfo = getSegmentInfo(undefined);

        // then
        expect(segmentInfo).toEqual(undefined);
    });

    it('return undefined for empty list', () => {
        // when
        const segmentInfo = getSegmentInfo([]);

        // then
        expect(segmentInfo).toEqual(undefined);
    });

    it('should extract information', () => {
        // when
        const aggregatedInfo = [
            { frontArrival: 200, frontPassage: 400, distanceInKm: 1, speed: 999 },
        ] as AggregatedPoints[];
        const segmentInfo = getSegmentInfo(aggregatedInfo);

        // then
        expect(segmentInfo).toEqual('1 km, 18 km/h, 3.3 min');
    });

    it('should extract information', () => {
        // when
        const aggregatedInfo = [
            { frontArrival: 200, frontPassage: 300, distanceInKm: 0.4, speed: 999 },
            { frontArrival: 300, frontPassage: 400, distanceInKm: 0.6, speed: 999 },
        ] as AggregatedPoints[];
        const segmentInfo = getSegmentInfo(aggregatedInfo);

        // then
        expect(segmentInfo).toEqual('1 km, 18 km/h, 3.3 min');
    });
});
