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

        describe('Three branches meet at one point', () => {
            const twoBranches = [
                { id: '1', segmentIds: ['A1', 'ABC'], peopleCount: 200 },
                { id: '2', segmentIds: ['B1', 'ABC'], peopleCount: 150 },
                { id: '3', segmentIds: ['C1', 'ABC'], peopleCount: 300 },
            ];
            it('the longest branch should reach first', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority2(twoBranches, '1');

                // then
                expect(number).toEqual(300);
            });

            it('earlier matched branches should stay together and are evaluated together', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority2(twoBranches, '2');

                // then
                expect(number).toEqual(500);
            });

            it('later added branches are compared against the combined strength', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority2(twoBranches, '3');

                // then
                expect(number).toEqual(0);
            });
        });

        describe('Two branched meet and then another', () => {
            const twoBranches = [
                { id: '1', segmentIds: ['A1', 'AB', 'ABC'], peopleCount: 200 },
                { id: '2', segmentIds: ['B1', 'AB', 'ABC'], peopleCount: 150 },
                { id: '3', segmentIds: ['C1', 'C2', 'ABC'], peopleCount: 300 },
            ];
            it('the longest branch should reach first', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority2(twoBranches, '1');

                // then
                expect(number).toEqual(0);
            });

            it('earlier matched branches should stay together and are evaluated together', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority2(twoBranches, '2');

                // then
                expect(number).toEqual(200);
            });

            it('later added branches are compared against the combined strength', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority2(twoBranches, '3');

                // then
                expect(number).toEqual(350);
            });
        });
    });
});
