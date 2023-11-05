import { aggregateEnrichedPoints, EnrichedPoints } from '../aggregateEnrichedPoints.ts';

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
});
