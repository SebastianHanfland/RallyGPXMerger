import { FormattedMessage, useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { NodeAtTrack } from '../../../common/calculation/nodes/nodeFinder.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
    getBranchTrackIds,
} from '../../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';
import { getNodeSpecifications } from '../../store/nodes.reducer.ts';
import { NodeSpecifications } from '../../store/types.ts';

type TrackNodeKind = 'headsMeet' | 'headsOnTail' | 'headIntoMiddle';

export function getTrackNodeType(
    trackNode: NodeAtTrack,
    nodeSpecifications: NodeSpecifications,
    branchNumbers: Record<string, number | undefined>
): TrackNodeKind {
    const branchTrackIds = getBranchTrackIds(trackNode);
    const branchSizes = Object.values(branchTrackIds)
        .filter((trackIds): trackIds is string[] => trackIds !== undefined)
        .map((trackIds) => branchNumbers[getBranchId(trackIds)] ?? 0);
    const total = branchSizes.reduce((sum, branchSize) => sum + branchSize, 0);
    const nodeSpecification = nodeSpecifications[trackNode.segmentIdAfterNode];

    if (!nodeSpecification) {
        return 'headsOnTail';
    }

    const hasMaximumOffset = Object.entries(branchTrackIds).some(([segmentId, trackIds]) => {
        if (!trackIds) {
            return false;
        }
        const branchSize = branchNumbers[getBranchId(trackIds)] ?? 0;
        const maximumOffset = total - branchSize;
        return (nodeSpecification?.trackOffsets[segmentId] ?? 0) === maximumOffset && maximumOffset > 0;
    });

    if (hasMaximumOffset) {
        return 'headsOnTail';
    }

    const hasOffset = Object.keys(branchTrackIds).some(
        (segmentId) => (nodeSpecification?.trackOffsets[segmentId] ?? 0) > 0
    );
    return hasOffset ? 'headIntoMiddle' : 'headsMeet';
}

const typeMessageIds: Record<TrackNodeKind, string> = {
    headsMeet: 'msg.nodeType.headsMeet',
    headsOnTail: 'msg.nodeType.headsOnTail',
    headIntoMiddle: 'msg.nodeType.headIntoMiddle',
};

const typeSymbols: Record<TrackNodeKind, string> = {
    headsMeet: '/\\',
    headsOnTail: '_/',
    headIntoMiddle: '-/',
};

interface Props {
    trackNode: NodeAtTrack;
}

export const TrackNodeType = ({ trackNode }: Props) => {
    const intl = useIntl();
    const nodeSpecifications = useSelector(getNodeSpecifications);
    const branchNumbers = useSelector(getBranchNumbersSelector);
    const type = getTrackNodeType(trackNode, nodeSpecifications, branchNumbers);
    const description = intl.formatMessage({ id: typeMessageIds[type] });

    return (
        <span title={description} aria-label={description}>
            {typeSymbols[type]}
            <span className="visually-hidden">
                <FormattedMessage id={typeMessageIds[type]} />
            </span>
        </span>
    );
};
