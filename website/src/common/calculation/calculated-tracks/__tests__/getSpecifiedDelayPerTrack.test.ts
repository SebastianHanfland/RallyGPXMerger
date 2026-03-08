import { NODE, NodeSpecifications, SEGMENT, TrackComposition } from '../../../../planner/store/types.ts';
import { getDelaysOfTracks, TrackDelay } from '../getSpecifiedDelayPerTrack.ts';

function getSegment(id: string) {
    return { id, segmentId: id, type: SEGMENT };
}

describe('getSpecifiedDelayPerTrack', () => {
    describe('getDelaysOfTrack', () => {
        interface TestCase {
            tracks: TrackComposition[];
            expectedDelays: { trackId: string; delays: TrackDelay[] }[];
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
            expectedDealy: { trackId: string; delays: TrackDelay[] }[],
            nodeSpecifications: NodeSpecifications | undefined,
            description: string
        ): TestCase => ({ tracks, expectedDelays: expectedDealy, nodeSpecifications, description });

        const executeTest = (testCase: TestCase) =>
            it(testCase.description, () => {
                const { tracks, expectedDelays, nodeSpecifications } = testCase;

                const delay = 1;

                // when
                const delay1 = getDelaysOfTracks(tracks, delay, nodeSpecifications);

                // then
                expect(delay1).toEqual(expectedDelays);
            });

        describe('only with people', () => {
            [
                createTestCase(
                    [createTrack1(10), createTrack2(20), createTrack3(25)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: -20, by: NODE },
                                { segmentId: 'ABC', extraDelay: -20, by: NODE },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: -20, by: NODE },
                                { segmentId: 'ABC', extraDelay: -20, by: NODE },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'A', extraDelay: -20, by: NODE }] },
                    ],
                    {},
                    '2 has more people than 1, they are before 3'
                ),
                // createTestCase(
                //     [createTrack1(10), createTrack2(20), createTrack3(35)],
                //     [-55, -35, -0],
                //     {},
                //     '2 has more people than 1, they are after 3'
                // ),
                // createTestCase(
                //     [createTrack1(30), createTrack2(20), createTrack3(35)],
                //     [-0, -30, -50],
                //     {},
                //     '1 has more people than 2, they are before 3'
                // ),
                // createTestCase(
                //     [createTrack1(30), createTrack2(20), createTrack3(55)],
                //     [-55, -85, -0],
                //     {},
                //     '1 has more people than 2, they are after 3'
                // ),
            ].forEach(executeTest);
        });

        describe('with people and priority', () => {
            [
                // createTestCase(
                //     [createTrack1(10, 1), createTrack2(20), createTrack3(25)],
                //     [-0, -10, -30],
                //     {},
                //     '2 has more people than 1, but 1 as higher prio, they are before 3'
                // ),
                // createTestCase(
                //     [createTrack1(10), createTrack2(20), createTrack3(25, 1)],
                //     [-45, -25, -0],
                //     {},
                //     '2 has more people than 1, they are after 3 because of prio not people'
                // ),
                // createTestCase(
                //     [createTrack1(10, 3), createTrack2(10, 2), createTrack3(10, 1)],
                //     [-0, -10, -20],
                //     {},
                //     'priorities rule out people, higher prio means first'
                // ),
                // createTestCase(
                //     [createTrack1(10, 1), createTrack2(10, 2), createTrack3(10, 3)],
                //     [-20, -10, -0],
                //     {},
                //     'priorities rule out people, higher even is first when it is a later branch'
                // ),
                // createTestCase(
                //     [createTrack1(10, 4), createTrack2(10, 2), createTrack3(10, 3)],
                //     [-0, -10, -20],
                //     {},
                //     'earlier merge values higher priority of branch for later nodes'
                // ),
            ].forEach(executeTest);
        });

        describe('with people and node specifications', () => {
            [
                // createTestCase(
                //     [createTrack1(10, 1), createTrack2(20), createTrack3(25)],
                //     [-0, -0, -20],
                //     {
                //         AB: { totalCount: 30, trackOffsets: { B1: 0, A1: 0 } },
                //         ABC: { totalCount: 30, trackOffsets: { AB: 0, C1: 0 } },
                //     },
                //     'No delay when all node specification give no extra delay'
                // ),
                // createTestCase(
                //     [createTrack1(10, 1), createTrack2(20), createTrack3(25)],
                //     [-0, -0, -20],
                //     { AB: { totalCount: 30, trackOffsets: { B1: 0, A1: 0 } } },
                //     'When A and B merges without delay, the maximum (20) is taken for delay for C'
                // ),
                // createTestCase(
                //     [createTrack1(10, 1), createTrack2(20), createTrack3(25)],
                //     [-0, -0, -20],
                //     { AB: { totalCount: 30, trackOffsets: { B1: 0, A1: 10 } } },
                //     'When the delay of A does not increase the length, the maximum (20) is taken for delay for C'
                // ),
                // createTestCase(
                //     [createTrack1(10, 1), createTrack2(20), createTrack3(25)],
                //     [-0, -0, -25],
                //     { AB: { totalCount: 30, trackOffsets: { B1: 0, A1: 15 } } },
                //     'When the delay of A increases the length, the maximum (10 + 15 = 25) is taken for delay for C'
                // ),
            ].forEach(executeTest);
        });

        describe('with people, priority and node specifications', () => {});
    });
});
