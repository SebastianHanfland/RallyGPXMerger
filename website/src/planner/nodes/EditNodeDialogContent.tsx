import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { listAllNodesOfTracks } from '../../common/calculation/nodes/nodeFinder.ts';
import { getBranchesAtNode } from './getBranchesAtNode.ts';
import { NodeEditInfo, NodeSpecification } from '../store/types.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
} from '../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';
import { EditNodeDialogBranchTitle } from './EditNodeDialogBranchTitle.tsx';
import { EditNodeDialogTrackProgressbar } from './EditNodeDialogTrackProgressbar.tsx';
import { EditNodeDialogDelayInput } from './EditNodeDialogDelayInput.tsx';
import { getBranchTracks } from './getBranchTracks.ts';
import {
    getNodeOffset,
    getNodeOffsetPercentage,
    setNodeOffsetPercentage,
} from '../../common/calculation/calculated-tracks/nodeSpecOffset.ts';

interface Props {
    nodeSpecs: NodeSpecification;
    setNodeSpecs: (nodeSpecs: NodeSpecification) => void;
    nodeEditInfo: NodeEditInfo;
}

const buttonHeight = '120px';

export const EditNodeDialogContent = ({ nodeSpecs, setNodeSpecs, nodeEditInfo }: Props) => {
    const intl = useIntl();
    const trackCompositions = useSelector(getTrackCompositions);
    const branchesAtNode = useSelector(getBranchesAtNode);
    const branchNumbers = useSelector(getBranchNumbersSelector);

    const direction = intl.formatMessage({ id: 'msg.direction' });

    const trackNodes = listAllNodesOfTracks(trackCompositions);
    const foundTrackNode = trackNodes.find((node) => node.segmentIdAfterNode === nodeEditInfo.segmentAfterId);

    if (!foundTrackNode || !branchesAtNode || !nodeEditInfo.segmentAfterId) {
        return null;
    }
    const branchTracks = getBranchTracks(nodeEditInfo.segmentAfterId, trackCompositions);
    if (!branchTracks) {
        return null;
    }

    let total = 0;
    Object.values(branchTracks).forEach((bTracks) => {
        total += branchNumbers[getBranchId(bTracks.map(({ id }) => id))] ?? 0;
    });

    return (
        <>
            <div>{`${direction} =>`}</div>
            {Object.entries(branchTracks).map(([segmentId, tracks]) => {
                const branchSize = branchNumbers[getBranchId(tracks.map(({ id }) => id))] ?? 0;
                const peopleOffset = getNodeOffset(nodeSpecs, segmentId, branchSize, total);
                const percentage = getNodeOffsetPercentage(nodeSpecs, segmentId, branchSize, total);

                const setPercentage = (newPercentage: number) => () => {
                    const boundedPercentage = Math.max(0, Math.min(100, newPercentage));
                    setNodeSpecs(setNodeOffsetPercentage(nodeSpecs, segmentId, boundedPercentage));
                };
                return (
                    <div key={segmentId}>
                        <EditNodeDialogBranchTitle segmentId={segmentId} tracks={tracks} peopleOffset={peopleOffset} />
                        <div
                            key={segmentId + '2'}
                            style={{ display: 'flex', justifyContent: 'row', alignItems: 'flex-end' }}
                        >
                            <div key={segmentId + '3'}>
                                <Button size={'sm'} style={{ height: buttonHeight }} onClick={setPercentage(100)}>
                                    {'<-'}
                                </Button>
                            </div>
                            <EditNodeDialogTrackProgressbar
                                segmentId={segmentId}
                                tracks={tracks}
                                total={total}
                                offset={peopleOffset}
                            />
                            <div key={segmentId + '4'}>
                                <Button size={'sm'} style={{ height: buttonHeight }} onClick={setPercentage(0)}>
                                    {'->'}
                                </Button>
                            </div>
                            <EditNodeDialogDelayInput
                                nodeSpecs={nodeSpecs}
                                setNodeSpecs={setNodeSpecs}
                                segmentId={segmentId}
                                peopleOffset={peopleOffset}
                                percentage={percentage}
                            />
                        </div>
                    </div>
                );
            })}
        </>
    );
};
