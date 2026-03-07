import { getExtraDelayOnTrack, sumUpAllPeopleWithHigherPriority } from '../peopleDelayCounter.ts';
import { listAllNodesOfTracks } from '../../nodes/nodeFinder.ts';
import { SEGMENT, TrackComposition, TrackSegment } from '../../../../planner/store/types.ts';

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
        function createSegment(segmentId: string): TrackSegment {
            return { id: segmentId, segmentId: segmentId, type: SEGMENT };
        }

        it('update delay accordingly', () => {
            // given
            const tracks: TrackComposition[] = [
                { id: '1', segments: ['A1', 'AB', 'ABC'].map(createSegment), peopleCount: 10 },
                { id: '2', segments: ['B1', 'AB', 'ABC'].map(createSegment), peopleCount: 20 },
                { id: '3', segments: ['C1', 'ABC'].map(createSegment), peopleCount: 30 },
            ] as TrackComposition[];
            const delay = 0.2;
            const nodeSpecifications = {};

            // when
            const delay1 = getExtraDelayOnTrack(tracks[0], tracks, delay, nodeSpecifications);
            const delay2 = getExtraDelayOnTrack(tracks[1], tracks, delay, nodeSpecifications);
            const delay3 = getExtraDelayOnTrack(tracks[2], tracks, delay, nodeSpecifications);

            // then
            expect([delay1, delay2, delay3]).toEqual([-4, -0, -6]);
        });
    });
});
