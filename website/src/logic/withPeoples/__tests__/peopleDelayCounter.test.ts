import { sumUpAllPeopleWithHigherPriority } from '../peopleDelayCounter.ts';

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
});
