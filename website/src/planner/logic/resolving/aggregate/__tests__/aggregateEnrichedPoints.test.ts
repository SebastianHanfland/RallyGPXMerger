import {
    aggregateEnrichedPoints,
    anyStreetNameMatch,
    EnrichedPoints,
    takeMostDetailedStreetName,
} from '../aggregateEnrichedPoints.ts';
import { TrackWayPointType } from '../../types.ts';

describe('aggregateEnrichedPoints', () => {
    describe('aggregateEnrichedPoints', () => {
        it('should take to and from when ', () => {
            // given
            const longList: EnrichedPoints[] = [
                {
                    street: 'Street A',
                    time: '2023-10-22T06:23:46Z',
                    lat: 1,
                    lon: 2,
                    ele: 3,
                } as unknown as EnrichedPoints,
            ];

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList, 0, []);

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
            const longList: EnrichedPoints[] = [
                {
                    street: 'Street A',
                    time: '2023-10-22T06:23:46Z',
                    lat: 1,
                    lon: 2,
                    ele: 3,
                } as unknown as EnrichedPoints,
            ];

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList, 100, []);

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
            const longList: EnrichedPoints[] = [
                { street: 'Street A', time: '2023-10-22T06:23:46Z', lat: 1, lon: 2, ele: 3 },
                { street: 'Street A', time: '2023-10-22T06:26:46Z', lat: 4, lon: 5, ele: 6 },
            ];

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList, 0, []);

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
            const longList: EnrichedPoints[] = [
                { street: 'Street A', time: '2023-10-22T06:23:46Z', lat: 1, lon: 2, ele: 3 },
                { street: 'Street A', time: '2023-10-22T06:26:46Z', lat: 4, lon: 5, ele: 3 },
                { street: 'Friedberger Straße', time: '2023-10-22T06:36:46Z', lat: 6, lon: 7, ele: 3 },
                { street: 'Friedberger Straße, B 300', time: '2023-10-22T06:46:46Z', lat: 1, lon: 2, ele: 3 },
                { street: 'Friedberger Straße, B 2, B 300', time: '2023-10-22T08:30:46Z', lat: 8, lon: 9, ele: 3 },
                { street: 'Meringer Straße, B 2', time: '2023-10-22T08:35:46Z', lat: 10, lon: 11, ele: 3 },
                { street: 'Meringer Straße', time: '2023-10-22T08:40:46Z', lat: 12, lon: 13, ele: 3 },
                { street: 'Street B', time: '2023-10-22T08:46:46Z', lat: 14, lon: 15, ele: 3 },
                { street: 'Street B', time: '2023-10-22T09:00:46Z', lat: 16, lon: 17, ele: 3 },
            ];

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList, 0, []);

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
            function createWayPointWithStreetName(street: string | null, lat: number) {
                return {
                    street,
                    time: '2023-10-22T06:23:46Z',
                    lat,
                    lon: 2,
                    ele: 3,
                } as unknown as EnrichedPoints;
            }

            it('should take previous street name it unknown occurs for 5 waypoints', () => {
                // given
                const longList: EnrichedPoints[] = [
                    createWayPointWithStreetName('A', 1),
                    createWayPointWithStreetName(null, 2),
                    createWayPointWithStreetName(null, 3),
                    createWayPointWithStreetName(null, 4),
                    createWayPointWithStreetName(null, 5),
                    createWayPointWithStreetName(null, 6),
                ];

                // when
                const aggregatedPoints = aggregateEnrichedPoints(longList, 100, []);

                // then
                expect(aggregatedPoints).toEqual([
                    {
                        streetName: 'A',
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
