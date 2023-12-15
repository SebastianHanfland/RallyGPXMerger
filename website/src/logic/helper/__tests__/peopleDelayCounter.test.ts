import { sumUpAllPeopleWithHigherPriority, sumUpAllPeopleWithHigherPriority2 } from '../peopleDelayCounter.ts';

describe('peopleDelayCounter', () => {
    describe('should sum up all people with higher priority', () => {
        it('should add up to zero when no segments are present', () => {
            // when
            const number = sumUpAllPeopleWithHigherPriority([], '1');

            // then
            expect(number).toEqual(0);
        });

        it('should add up to zero when index is zero', () => {
            // when
            const number = sumUpAllPeopleWithHigherPriority(
                [
                    { segmentId: '1', amount: 100, trackId: '1' },
                    { segmentId: '2', amount: 50, trackId: '2' },
                ],
                '1'
            );

            // then
            expect(number).toEqual(0);
        });

        it('should add up other segments when they have more people', () => {
            // when
            const number = sumUpAllPeopleWithHigherPriority(
                [
                    { segmentId: '1', amount: 100, trackId: '1' },
                    { segmentId: '2', amount: 50, trackId: '2' },
                ],
                '2'
            );

            // then
            expect(number).toEqual(100);
        });
    });

    describe('should find the number of people that reach the end before track', () => {
        it('should add up to zero when no segments are present', () => {
            // when
            const number = sumUpAllPeopleWithHigherPriority2([], '1');

            // then
            expect(number).toEqual(0);
        });

        describe('Two branches', () => {
            const twoBranches = [
                { id: '1', segmentIds: ['A1', 'AB'], peopleCount: 200 },
                { id: '2', segmentIds: ['B1', 'AB'], peopleCount: 150 },
            ];
            it('should add up to zero when index is zero', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority2(twoBranches, '1');

                // then
                expect(number).toEqual(0);
            });

            it('should add up other segments when they have more people', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority2(twoBranches, '2');

                // then
                expect(number).toEqual(200);
            });
        });
    });
});
