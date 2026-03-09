import { NodeSpecifications, SEGMENT, TrackComposition } from '../../../../planner/store/types.ts';
import { getBranchNumbers } from '../nodeSpecResultingBranchSize.ts';

describe('test block', () => {
    function getSegment(id: string) {
        return { id, segmentId: id, type: SEGMENT };
    }

    const createTrack1 = (peopleCount: number, priority?: number) =>
        ({ id: '1', segments: ['A1', 'AB', 'ABC'].map(getSegment), peopleCount, priority } as TrackComposition);
    const createTrack2 = (peopleCount: number, priority?: number) =>
        ({ id: '2', segments: ['B1', 'AB', 'ABC'].map(getSegment), peopleCount, priority } as TrackComposition);
    const createTrack3 = (peopleCount: number, priority?: number) =>
        ({ id: '3', segments: ['C1', 'ABC'].map(getSegment), peopleCount, priority } as TrackComposition);

    interface TestCase {
        tracks: TrackComposition[];
        nodeSpecs: NodeSpecifications;
        expectedBranchNumbers: Record<string, number>;
        description: string;
    }

    const testCases: TestCase[] = [
        {
            tracks: [createTrack1(10), createTrack2(20), createTrack3(30)],
            nodeSpecs: {},
            expectedBranchNumbers: { '1': 10, '2': 20, '3': 30, '1-2': 30, '1-2-3': 60 },
            description: 'should just fill all track occurrences with plain numbers of tracks',
        },
    ];

    testCases.forEach((testCase) =>
        it(testCase.description, () => {
            // when
            const branchNumbers = getBranchNumbers(testCase.nodeSpecs, testCase.tracks);

            // then
            expect(branchNumbers).toEqual(testCase.expectedBranchNumbers);
        })
    );
});
