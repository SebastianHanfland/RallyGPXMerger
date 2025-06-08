import { aggregateEnrichedPoints, anyStreetNameMatch, takeMostDetailedStreetName } from '../aggregateEnrichedPoints.ts';
import { TrackWayPointType } from '../../types.ts';
import { TimedPoint } from '../../../../new-store/types.ts';

describe('aggregateEnrichedPoints', () => {
    describe('aggregateEnrichedPoints', () => {
        it('should take to and from when ', () => {
            // given
            const longList: TimedPoint[] = [
                {
                    s: 1,
                    t: '2023-10-22T06:23:46Z',
                    b: 1,
                    l: 2,
                    e: 3,
                },
            ];
            const streetLookup = { 1: 'Street A' };

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList, 0, [], streetLookup);

            // then
            expect(aggregatedPoints).toEqual([
                {
                    streetName: 'Street A',
                    frontArrival: '2023-10-22T06:23:46Z',
                    backArrival: '2023-10-22T06:23:46.000Z',
                    frontPassage: '2023-10-22T06:23:46Z',
                    pointFrom: { lat: 1, lon: 2, time: '2023-10-22T06:23:46Z' },
                    pointTo: { lat: 1, lon: 2, time: '2023-10-22T06:23:46Z' },
                    type: TrackWayPointType.Track,
                },
            ]);
        });

        it('should take participants into account ', () => {
            // given
            const longList: TimedPoint[] = [
                {
                    s: 1,
                    t: '2023-10-22T06:23:46Z',
                    b: 1,
                    l: 2,
                    e: 3,
                },
            ];
            const streetLookup = { 1: 'Street A' };

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList, 100, [], streetLookup);

            // then
            expect(aggregatedPoints).toEqual([
                {
                    streetName: 'Street A',
                    frontArrival: '2023-10-22T06:23:46Z',
                    backArrival: '2023-10-22T06:24:06.000Z',
                    frontPassage: '2023-10-22T06:23:46Z',
                    pointFrom: { lat: 1, lon: 2, time: '2023-10-22T06:23:46Z' },
                    pointTo: { lat: 1, lon: 2, time: '2023-10-22T06:23:46Z' },
                    type: TrackWayPointType.Track,
                },
            ]);
        });

        it('should group points according to streetNames', () => {
            // given
            const longList: TimedPoint[] = [
                { s: 1, t: '2023-10-22T06:23:46Z', b: 1, l: 2, e: 3 },
                { s: 1, t: '2023-10-22T06:26:46Z', b: 4, l: 5, e: 6 },
            ];
            const streetLookup = { 1: 'Street A' };

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList, 0, [], streetLookup);

            // then
            expect(aggregatedPoints).toEqual([
                {
                    streetName: 'Street A',
                    frontArrival: '2023-10-22T06:23:46Z',
                    backArrival: '2023-10-22T06:26:46.000Z',
                    frontPassage: '2023-10-22T06:26:46Z',
                    distanceInKm: 471.4858683408698,
                    pointFrom: { lat: 1, lon: 2, time: '2023-10-22T06:23:46Z' },
                    pointTo: { lat: 4, lon: 5, time: '2023-10-22T06:26:46Z' },
                    speed: 9429.717366817395,
                    type: TrackWayPointType.Track,
                },
            ]);
        });

        it('should group points according to streetNames when similar parts exist', () => {
            // given
            const longList: TimedPoint[] = [
                { s: 1, t: '2023-10-22T06:23:46Z', b: 1, l: 2, e: 3 },
                { s: 1, t: '2023-10-22T06:26:46Z', b: 4, l: 5, e: 3 },
                { s: 2, t: '2023-10-22T06:36:46Z', b: 6, l: 7, e: 3 },
                { s: 3, t: '2023-10-22T06:46:46Z', b: 1, l: 2, e: 3 },
                { s: 4, t: '2023-10-22T08:30:46Z', b: 8, l: 9, e: 3 },
                { s: 5, t: '2023-10-22T08:35:46Z', b: 10, l: 11, e: 3 },
                { s: 6, t: '2023-10-22T08:40:46Z', b: 12, l: 13, e: 3 },
                { s: 7, t: '2023-10-22T08:46:46Z', b: 14, l: 15, e: 3 },
                { s: 7, t: '2023-10-22T09:00:46Z', b: 16, l: 17, e: 3 },
            ];
            const streetLookup = {
                1: 'Street A',
                2: 'Friedberger Straße',
                3: 'Friedberger Straße, B 300',
                4: 'Friedberger Straße, B 2, B 300',
                5: 'Meringer Straße, B 2',
                6: 'Meringer Straße',
                7: 'Street B',
            };

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList, 0, [], streetLookup);

            // then
            expect(aggregatedPoints).toEqual([
                {
                    streetName: 'Street A',
                    distanceInKm: 471.4858683408698,
                    speed: 9429.717366817395,
                    frontArrival: '2023-10-22T06:23:46Z',
                    backArrival: '2023-10-22T06:36:46.000Z',
                    frontPassage: '2023-10-22T06:36:46Z',
                    pointFrom: { lat: 1, lon: 2, time: '2023-10-22T06:23:46Z' },
                    pointTo: { lat: 6, lon: 7, time: '2023-10-22T06:36:46Z' },
                    type: TrackWayPointType.Track,
                },
                {
                    frontArrival: '2023-10-22T06:36:46Z',
                    distanceInKm: 1884.0458656194241,
                    speed: 991.6030871681179,
                    streetName: 'Friedberger Straße, B 300, B 2',
                    backArrival: '2023-10-22T08:35:46.000Z',
                    frontPassage: '2023-10-22T08:35:46Z',
                    pointFrom: { lat: 6, lon: 7, time: '2023-10-22T06:36:46Z' },
                    pointTo: { lat: 10, lon: 11, time: '2023-10-22T08:35:46Z' },
                    type: TrackWayPointType.Track,
                },
                {
                    frontArrival: '2023-10-22T08:35:46Z',
                    distanceInKm: 311.60703289452334,
                    speed: 3739.28439473428,
                    streetName: 'Meringer Straße, B 2',
                    backArrival: '2023-10-22T08:46:46.000Z',
                    frontPassage: '2023-10-22T08:46:46Z',
                    pointFrom: { lat: 10, lon: 11, time: '2023-10-22T08:35:46Z' },
                    pointTo: { lat: 14, lon: 15, time: '2023-10-22T08:46:46Z' },
                    type: TrackWayPointType.Track,
                },
                {
                    frontArrival: '2023-10-22T08:46:46Z',
                    distanceInKm: 309.17030795737253,
                    speed: 1325.0156055315967,
                    streetName: 'Street B',
                    backArrival: '2023-10-22T09:00:46.000Z',
                    frontPassage: '2023-10-22T09:00:46Z',
                    pointFrom: { lat: 14, lon: 15, time: '2023-10-22T08:46:46Z' },
                    pointTo: { lat: 16, lon: 17, time: '2023-10-22T09:00:46Z' },
                    type: TrackWayPointType.Track,
                },
            ]);
        });

        describe('getting rid of unknown streets', () => {
            function createWayPointWithStreetName(street: number, lat: number): TimedPoint {
                return {
                    s: street,
                    t: '2023-10-22T06:23:46Z',
                    b: lat,
                    l: 2,
                    e: 3,
                };
            }

            it('should take previous street name it unknown occurs for 5 waypoints', () => {
                // given
                const longList: TimedPoint[] = [
                    createWayPointWithStreetName(1, 1),
                    createWayPointWithStreetName(-1, 2),
                    createWayPointWithStreetName(-1, 3),
                    createWayPointWithStreetName(-1, 4),
                    createWayPointWithStreetName(-1, 5),
                    createWayPointWithStreetName(-1, 6),
                ];
                const streetLookup = { 1: 'Street A' };

                // when
                const aggregatedPoints = aggregateEnrichedPoints(longList, 100, [], streetLookup);

                // then
                expect(aggregatedPoints).toEqual([
                    {
                        streetName: 'Street A',
                        frontArrival: '2023-10-22T06:23:46Z',
                        backArrival: '2023-10-22T06:24:06.000Z',
                        frontPassage: '2023-10-22T06:23:46Z',
                        pointFrom: { lat: 1, lon: 2, time: '2023-10-22T06:23:46Z' },
                        pointTo: { lat: 6, lon: 2, time: '2023-10-22T06:23:46Z' },
                        type: TrackWayPointType.Track,
                    },
                    {
                        backArrival: '2023-10-22T06:24:06.000Z',
                        frontArrival: '2023-10-22T06:23:46Z',
                        frontPassage: '2023-10-22T06:23:46Z',
                        pointFrom: { lat: 6, lon: 2, time: '2023-10-22T06:23:46Z' },
                        pointTo: { lat: 6, lon: 2, time: '2023-10-22T06:23:46Z' },
                        streetName: null,
                        type: 'TRACK',
                    },
                ]);
            });
        });
    });
    describe('anyStreetNameMatch', () => {
        it('should find a match', () => {
            // when
            const hasMatch = anyStreetNameMatch('A, B', 'A');

            // then
            expect(hasMatch).toBeTruthy();
        });

        it('should find no match', () => {
            // when
            const hasMatch = anyStreetNameMatch('A, B', 'C');

            // then
            expect(hasMatch).toBeFalsy();
        });
    });
    describe('takeMostDetailedStreetName', () => {
        it('should find a match', () => {
            // when
            const detailedStreetName = takeMostDetailedStreetName('B, C', 'B, A');

            // then
            expect(detailedStreetName).toEqual('B, A, C');
        });

        it('should find no match', () => {
            // when
            const detailedStreetName = takeMostDetailedStreetName('A, B', 'C');

            // then
            expect(detailedStreetName).toEqual('A, B');
        });
    });
});
