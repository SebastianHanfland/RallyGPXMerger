import { sumUpAllPeopleWithHigherPriority } from '../peopleDelayCounter.ts';
import { listAllNodesOfTracks } from '../nodeFinder.ts';

describe('peopleDelayCounter', () => {
    describe('should find the number of people that reach the end before track', () => {
        describe('Two branches', () => {
            const twoBranches = [
                { id: '1', segmentIds: ['A1', 'AB'], peopleCount: 200 },
                { id: '2', segmentIds: ['B1', 'AB'], peopleCount: 150 },
            ];
            const trackNode = listAllNodesOfTracks(twoBranches)[0];
            it('should add up to zero when index is zero', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority(twoBranches, trackNode, '1');

                // then
                expect(number).toEqual(0);
            });

            it('should add up other segments when they have more people', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority(twoBranches, trackNode, '2');

                // then
                expect(number).toEqual(200);
            });
        });

        describe('Three branches meet at one point', () => {
            const threeBranches = [
                { id: '1', segmentIds: ['A1', 'ABC'], peopleCount: 200 },
                { id: '2', segmentIds: ['B1', 'ABC'], peopleCount: 150 },
                { id: '3', segmentIds: ['C1', 'ABC'], peopleCount: 300 },
            ];
            const trackNodes = listAllNodesOfTracks(threeBranches);
            it('the longest branch should reach first', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority(threeBranches, trackNodes[0], '1');

                // then
                expect(number).toEqual(300);
            });

            it('earlier matched branches should stay together and are evaluated together', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority(threeBranches, trackNodes[0], '2');

                // then
                expect(number).toEqual(500);
            });

            it('later added branches are compared against the combined strength', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority(threeBranches, trackNodes[0], '3');

                // then
                expect(number).toEqual(0);
            });
        });

        describe('Two branched meet and then another', () => {
            const threeBranches = [
                { id: '1', segmentIds: ['A1', 'AB', 'ABC'], peopleCount: 200 },
                { id: '2', segmentIds: ['B1', 'AB', 'ABC'], peopleCount: 150 },
                { id: '3', segmentIds: ['C1', 'C2', 'ABC'], peopleCount: 300 },
            ];
            const trackNodes = listAllNodesOfTracks(threeBranches);
            it('the longest branch should reach first', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority(threeBranches, trackNodes[0], '1');

                // then
                expect(number).toEqual(0);
            });

            it('earlier matched branches should stay together and are evaluated together', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority(threeBranches, trackNodes[0], '2');

                // then
                expect(number).toEqual(200);
            });

            it('later added branches are compared against the combined strength', () => {
                // when

                const number = sumUpAllPeopleWithHigherPriority(threeBranches, trackNodes[0], '3');

                // then
                expect(number).toEqual(0);
            });

            it('the longest branch should reach first 2', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority(threeBranches, trackNodes[1], '1');

                // then
                expect(number).toEqual(0);
            });

            it('earlier matched branches should stay together and are evaluated together 2', () => {
                // when
                const number = sumUpAllPeopleWithHigherPriority(threeBranches, trackNodes[1], '2');

                // then
                expect(number).toEqual(0);
            });

            it('later added branches are compared against the combined strength 2', () => {
                // when

                const number = sumUpAllPeopleWithHigherPriority(threeBranches, trackNodes[1], '3');

                // then
                expect(number).toEqual(350);
            });
        });
    });
});
