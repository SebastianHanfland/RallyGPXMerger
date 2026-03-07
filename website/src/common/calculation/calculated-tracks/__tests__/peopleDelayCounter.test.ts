import { getExtraDelayOnTrack, sumUpAllPeopleWithHigherPriority } from '../peopleDelayCounter.ts';
import { listAllNodesOfTracks } from '../../nodes/nodeFinder.ts';
import { NodeSpecifications, SEGMENT, TrackComposition } from '../../../../planner/store/types.ts';

function getSegment(id: string) {
    return { id, segmentId: id, type: SEGMENT };
}

describe('peopleDelayCounter', () => {
    describe('should find the number of people that reach the end before track', () => {
        describe('Two branches', () => {
            const twoBranches = [
                { id: '1', segments: ['A1', 'AB'].map(getSegment), peopleCount: 200 },
                { id: '2', segments: ['B1', 'AB'].map(getSegment), peopleCount: 150 },
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
                { id: '1', segments: ['A1', 'ABC'].map(getSegment), peopleCount: 200 },
                { id: '2', segments: ['B1', 'ABC'].map(getSegment), peopleCount: 150 },
                { id: '3', segments: ['C1', 'ABC'].map(getSegment), peopleCount: 300 },
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
                { id: '1', segments: ['A1', 'AB', 'ABC'].map(getSegment), peopleCount: 200 },
                { id: '2', segments: ['B1', 'AB', 'ABC'].map(getSegment), peopleCount: 150 },
                { id: '3', segments: ['C1', 'C2', 'ABC'].map(getSegment), peopleCount: 300 },
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

    describe('getExtraDelayOnTrack', () => {
        interface TestCase {
            tracks: TrackComposition[];
            expectedDelays: number[];
            nodeSpecifications: NodeSpecifications | undefined;
            description: string;
        }

        const createTrack1 = (peopleCount: number, priority?: number) =>
            ({ id: '1', segments: ['A1', 'AB', 'ABC'].map(getSegment), peopleCount, priority } as TrackComposition);
        const createTrack2 = (peopleCount: number, priority?: number) =>
            ({ id: '2', segments: ['B1', 'AB', 'ABC'].map(getSegment), peopleCount, priority } as TrackComposition);
        const createTrack3 = (peopleCount: number, priority?: number) =>
            ({ id: '3', segments: ['C1', 'ABC'].map(getSegment), peopleCount, priority } as TrackComposition);

        const createTestCase = (
            tracks: TrackComposition[],
            expectedDealy: number[],
            nodeSpecifications: NodeSpecifications | undefined,
            description: string
        ): TestCase => ({ tracks, expectedDelays: expectedDealy, nodeSpecifications, description });

        const executeTest = (testCase: TestCase) =>
            it(testCase.description, () => {
                const { tracks, expectedDelays, nodeSpecifications } = testCase;

                const delay = 1;

                // when
                const delay1 = getExtraDelayOnTrack(tracks[0], tracks, delay, nodeSpecifications);
                const delay2 = getExtraDelayOnTrack(tracks[1], tracks, delay, nodeSpecifications);
                const delay3 = getExtraDelayOnTrack(tracks[2], tracks, delay, nodeSpecifications);

                // then
                expect([delay1, delay2, delay3]).toEqual(expectedDelays);
            });

        describe('only with people', () => {
            [
                createTestCase(
                    [createTrack1(10), createTrack2(20), createTrack3(30)],
                    [-20, -0, -30],
                    {},
                    '2 has more people than 1, they are before 3'
                ),
                createTestCase(
                    [createTrack1(30), createTrack2(20), createTrack3(10)],
                    [-0, -30, -50],
                    {},
                    '1 has more people than 2, they are before 3'
                ),
            ].forEach(executeTest);
        });

        describe('with people and priority', () => {});

        describe('with people and node specifications', () => {});

        describe('with people, priority and node specifications', () => {});
    });
});
