import { NodeAtTrack } from '../../../common/calculation/nodes/nodeFinder.ts';
import { NodeSpecifications } from '../../store/types.ts';
import { getTrackNodeType } from './TrackNodeType.tsx';

const trackNode: NodeAtTrack = {
    segmentIdAfterNode: 'after',
    segmentsBeforeNode: [
        { segmentId: 'before-a', trackId: 'track-a', amount: 10 },
        { segmentId: 'before-b', trackId: 'track-b', amount: 20 },
    ],
};

const branchNumbers = { 'track-a': 10, 'track-b': 20 };

describe('getTrackNodeType', () => {
    it('identifies heads on tail when there is no node specification', () => {
        expect(getTrackNodeType(trackNode, {}, branchNumbers)).toBe('headsOnTail');
    });

    it('identifies a head entering the middle for a partial offset', () => {
        const nodeSpecifications: NodeSpecifications = {
            after: { totalCount: 30, trackOffsets: { 'before-a': 5 } },
        };

        expect(getTrackNodeType(trackNode, nodeSpecifications, branchNumbers)).toBe('headIntoMiddle');
    });

    it('identifies heads on tail when a branch reaches its maximum offset', () => {
        const nodeSpecifications: NodeSpecifications = {
            after: { totalCount: 30, trackOffsets: { 'before-a': 20 } },
        };

        expect(getTrackNodeType(trackNode, nodeSpecifications, branchNumbers)).toBe('headsOnTail');
    });

    it('identifies heads on tail when multiple branches reach their maximum offset', () => {
        const nodeSpecifications: NodeSpecifications = {
            after: { totalCount: 30, trackOffsets: { 'before-a': 20, 'before-b': 10 } },
        };

        expect(getTrackNodeType(trackNode, nodeSpecifications, branchNumbers)).toBe('headsOnTail');
    });
});
