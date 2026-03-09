import {
    NODE_SPEC,
    NodeSpecifications,
    PEOPLE,
    PRIORITY,
    SEGMENT,
    TrackComposition,
} from '../../../../planner/store/types.ts';
import { getDelaysOfTracks, TrackDelayDetails } from '../getSpecifiedDelayPerTrack.ts';

function getSegment(id: string) {
    return { id, segmentId: id, type: SEGMENT };
}

describe('getSpecifiedDelayPerTrack', () => {
    describe('getDelaysOfTrack', () => {
        interface TestCase {
            tracks: TrackComposition[];
            expectedDelays: TrackDelayDetails[];
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
            expectedDealy: TrackDelayDetails[],
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
                                { segmentId: 'AB', extraDelay: 20, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 0, by: PEOPLE },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 0, by: PEOPLE },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 30, by: PEOPLE }] },
                    ],
                    {},
                    '2 has more people than 1, they are before 3'
                ),
                createTestCase(
                    [createTrack1(10), createTrack2(10), createTrack3(20)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 10, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 20, by: PEOPLE },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 20, by: PEOPLE },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 0, by: PEOPLE }] },
                    ],
                    {},
                    'should choose any track when size is the same'
                ),
                createTestCase(
                    [createTrack1(10), createTrack2(20), createTrack3(35)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 20, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 35, by: PEOPLE },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 35, by: PEOPLE },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 0, by: PEOPLE }] },
                    ],
                    {},
                    '2 has more people than 1, they are after 3'
                ),
                createTestCase(
                    [createTrack1(30), createTrack2(20), createTrack3(35)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 0, by: PEOPLE },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 30, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 0, by: PEOPLE },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 50, by: PEOPLE }] },
                    ],
                    {},
                    '1 has more people than 2, they are before 3'
                ),
                createTestCase(
                    [createTrack1(30), createTrack2(20), createTrack3(55)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 55, by: PEOPLE },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 30, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 55, by: PEOPLE },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 0, by: PEOPLE }] },
                    ],
                    {},
                    '1 has more people than 2, they are after 3'
                ),
            ].forEach(executeTest);
        });

        describe('with people and priority', () => {
            [
                createTestCase(
                    [createTrack1(10, 1), createTrack2(20), createTrack3(25)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PRIORITY },
                                { segmentId: 'ABC', extraDelay: 0, by: PRIORITY },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 10, by: PRIORITY },
                                { segmentId: 'ABC', extraDelay: 0, by: PRIORITY },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 30, by: PRIORITY }] },
                    ],
                    {},
                    '2 has more people than 1, but 1 as higher prio, they are before 3'
                ),
                createTestCase(
                    [createTrack1(10), createTrack2(20), createTrack3(25, 1)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 20, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 25, by: PRIORITY },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PEOPLE },
                                { segmentId: 'ABC', extraDelay: 25, by: PRIORITY },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 0, by: PRIORITY }] },
                    ],
                    {},
                    '2 has more people than 1, they are after 3 because of prio not people'
                ),
                createTestCase(
                    [createTrack1(10, 3), createTrack2(10, 2), createTrack3(10, 1)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PRIORITY },
                                { segmentId: 'ABC', extraDelay: 0, by: PRIORITY },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 10, by: PRIORITY },
                                { segmentId: 'ABC', extraDelay: 0, by: PRIORITY },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 20, by: PRIORITY }] },
                    ],
                    {},
                    'priorities rule out people, higher prio means first'
                ),
                createTestCase(
                    [createTrack1(10, 1), createTrack2(10, 2), createTrack3(10, 3)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 10, by: PRIORITY },
                                { segmentId: 'ABC', extraDelay: 10, by: PRIORITY },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PRIORITY },
                                { segmentId: 'ABC', extraDelay: 10, by: PRIORITY },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 0, by: PRIORITY }] },
                    ],
                    {},
                    'priorities rule out people, higher even is first when it is a later branch'
                ),
                createTestCase(
                    [createTrack1(10, 4), createTrack2(10, 2), createTrack3(10, 3)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: PRIORITY },
                                { segmentId: 'ABC', extraDelay: 0, by: PRIORITY },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 10, by: PRIORITY },
                                { segmentId: 'ABC', extraDelay: 0, by: PRIORITY },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 20, by: PRIORITY }] },
                    ],
                    {},
                    'earlier merge values higher priority of branch for later nodes'
                ),
            ].forEach(executeTest);
        });

        describe('with people and node specifications', () => {
            [
                createTestCase(
                    [createTrack1(10), createTrack2(20), createTrack3(25)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: NODE_SPEC },
                                { segmentId: 'ABC', extraDelay: 0, by: NODE_SPEC },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: NODE_SPEC },
                                { segmentId: 'ABC', extraDelay: 0, by: NODE_SPEC },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 0, by: NODE_SPEC }] },
                    ],
                    {
                        AB: { totalCount: 30, trackOffsets: { B1: 0, A1: 0 } },
                        ABC: { totalCount: 30, trackOffsets: { AB: 0, C1: 0 } },
                    },
                    'No delay when all node specification give no extra delay'
                ),
                createTestCase(
                    [createTrack1(10), createTrack2(20), createTrack3(25)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: NODE_SPEC },
                                { segmentId: 'ABC', extraDelay: 25, by: PEOPLE },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: NODE_SPEC },
                                { segmentId: 'ABC', extraDelay: 25, by: PEOPLE },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 0, by: PEOPLE }] },
                    ],
                    { AB: { totalCount: 30, trackOffsets: { B1: 0, A1: 0 } } },
                    'When A and B merges without delay, the maximum (20) is taken for check for C, so C goes first'
                ),
                createTestCase(
                    [createTrack1(10), createTrack2(20), createTrack3(25)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 10, by: NODE_SPEC },
                                { segmentId: 'ABC', extraDelay: 25, by: PEOPLE },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: NODE_SPEC },
                                { segmentId: 'ABC', extraDelay: 25, by: PEOPLE },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 0, by: PEOPLE }] },
                    ],
                    { AB: { totalCount: 30, trackOffsets: { B1: 0, A1: 10 } } },
                    'When the delay of A does not increase the length, the maximum (20) is taken for delay for C'
                ),
                createTestCase(
                    [createTrack1(10), createTrack2(20), createTrack3(25)],
                    [
                        {
                            trackId: '1',
                            delays: [
                                { segmentId: 'AB', extraDelay: 16, by: NODE_SPEC },
                                { segmentId: 'ABC', extraDelay: 0, by: PEOPLE },
                            ],
                        },
                        {
                            trackId: '2',
                            delays: [
                                { segmentId: 'AB', extraDelay: 0, by: NODE_SPEC },
                                { segmentId: 'ABC', extraDelay: 0, by: PEOPLE },
                            ],
                        },
                        { trackId: '3', delays: [{ segmentId: 'ABC', extraDelay: 26, by: PEOPLE }] },
                    ],
                    { AB: { totalCount: 30, trackOffsets: { B1: 0, A1: 16 } } },
                    'When the delay of A increases the length, the maximum (10 + 16 = 26) is taken for delay for C, because it has less'
                ),
            ].forEach(executeTest);
        });

        describe('with people, priority and node specifications', () => {
            it('should just pass', () => {
                // given
                // when
                // then
            });
        });
    });
});
