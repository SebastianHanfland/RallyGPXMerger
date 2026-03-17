import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import Button from 'react-bootstrap/Button';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { listAllNodesOfTracks } from '../../common/calculation/nodes/nodeFinder.ts';
import { getBranchesAtNode, getBranchTracks } from './getBranchesAtNode.ts';
import { NodeEditInfo, NodeSpecification } from '../store/types.ts';
import {
    getBranchId,
    getBranchNumbersSelector,
} from '../../common/calculation/calculated-tracks/nodeSpecResultingBranchSize.ts';
import { EditNodeDialogBranchTitle } from './EditNodeDialogBranchTitle.tsx';
import { EditNodeDialogTrackProgressbar } from './EditNodeDialogTrackProgressbar.tsx';
import { EditNodeDialogDelayInput } from './EditNodeDialogDelayInput.tsx';

function getNodeDelayValue(numberValue: number, branchParticipants: number, total: number) {
    const maximum = (total ?? 0) - branchParticipants;
    if (numberValue > maximum) {
        return maximum;
    }
    if (numberValue < 0) {
        return 0;
    }
    return numberValue;
}

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
                const peopleOffset = nodeSpecs.trackOffsets[segmentId] ?? 0;
                const branchSize = branchNumbers[getBranchId(tracks.map(({ id }) => id))] ?? 0;

                const shiftOffset = (offSet: number) => () => {
                    const newValue = getNodeDelayValue((peopleOffset ?? 0) + offSet, branchSize, total);
                    setNodeSpecs({
                        ...nodeSpecs,
                        trackOffsets: { ...nodeSpecs.trackOffsets, [segmentId]: newValue },
                    });
                };
                return (
                    <div key={segmentId}>
                        <EditNodeDialogBranchTitle segmentId={segmentId} tracks={tracks} peopleOffset={peopleOffset} />
                        <div
                            key={segmentId + '2'}
                            style={{ display: 'flex', justifyContent: 'row', alignItems: 'flex-end' }}
                        >
                            <div key={segmentId + '3'}>
                                <Button size={'sm'} style={{ height: buttonHeight }} onClick={shiftOffset(100000000)}>
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
                                <Button size={'sm'} style={{ height: buttonHeight }} onClick={shiftOffset(-100000000)}>
                                    {'->'}
                                </Button>
                            </div>
                            <EditNodeDialogDelayInput
                                nodeSpecs={nodeSpecs}
                                setNodeSpecs={setNodeSpecs}
                                segmentId={segmentId}
                                branchSize={branchSize}
                                total={total}
                            />
                        </div>
                    </div>
                );
            })}
        </>
    );
};
