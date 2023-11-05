import {
    aggregateEnrichedPoints,
    anyStreetNameMatch,
    EnrichedPoints,
    takeMostDetailedStreetName,
} from '../aggregateEnrichedPoints.ts';

describe('aggregateEnrichedPoints', () => {
    describe('aggregateEnrichedPoints', () => {
        it('should take to and from when ', () => {
            // given
            const longList: EnrichedPoints[] = [{ street: 'Street A', time: '2023-10-22T06:23:46Z' }];

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList);

            // then
            expect(aggregatedPoints).toEqual([
                { streetName: 'Street A', from: '2023-10-22T06:23:46Z', to: '2023-10-22T06:23:46Z' },
            ]);
        });

        it('should group points according to streetNames', () => {
            // given
            const longList: EnrichedPoints[] = [
                { street: 'Street A', time: '2023-10-22T06:23:46Z' },
                { street: 'Street A', time: '2023-10-22T06:26:46Z' },
            ];

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList);

            // then
            expect(aggregatedPoints).toEqual([
                { streetName: 'Street A', from: '2023-10-22T06:23:46Z', to: '2023-10-22T06:26:46Z' },
            ]);
        });

        it('should group points according to streetNames when similar parts exist', () => {
            // given
            const longList: EnrichedPoints[] = [
                { street: 'Street A', time: '2023-10-22T06:23:46Z' },
                { street: 'Street A', time: '2023-10-22T06:26:46Z' },
                { street: 'Friedberger Straße', time: '2023-10-22T06:36:46Z' },
                { street: 'Friedberger Straße, B 300', time: '2023-10-22T06:46:46Z' },
                { street: 'Friedberger Straße', time: '2023-10-22T06:56:46Z' },
                { street: 'Friedberger Straße, B 300', time: '2023-10-22T07:26:46Z' },
                { street: 'Friedberger Straße, B 2, B 300', time: '2023-10-22T08:30:46Z' },
                { street: 'Street B', time: '2023-10-22T08:46:46Z' },
                { street: 'Street B', time: '2023-10-22T09:00:46Z' },
            ];

            // when
            const aggregatedPoints = aggregateEnrichedPoints(longList);

            // then
            expect(aggregatedPoints).toEqual([
                { streetName: 'Street A', from: '2023-10-22T06:23:46Z', to: '2023-10-22T06:26:46Z' },
                {
                    from: '2023-10-22T06:36:46Z',
                    streetName: 'Friedberger Straße, B 300, B 2',
                    to: '2023-10-22T08:30:46Z',
                },
                {
                    from: '2023-10-22T08:46:46Z',
                    streetName: 'Street B',
                    to: '2023-10-22T09:00:46Z',
                },
            ]);
        });
    });
    describe('anyStreetNameMatch', () => {
        it('should find a match', () => {
            // when
            const hasMatch = anyStreetNameMatch('A, B', 'B');

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
            const detailedStreetName = takeMostDetailedStreetName('B, C', 'A, B');

            // then
            expect(detailedStreetName).toEqual('A, B, C');
        });

        it('should find no match', () => {
            // when
            const detailedStreetName = takeMostDetailedStreetName('A, B', 'C');

            // then
            expect(detailedStreetName).toEqual('A, B');
        });
    });
});
