import { useDispatch, useSelector } from 'react-redux';
import { TrackNode } from '../../common/calculation/nodes/nodeFinder.ts';
import { getNodeSpecifications, nodesActions } from '../store/nodes.reducer.ts';
import nodeIcon from '../../assets/mergeTracks.svg';
import Button from 'react-bootstrap/Button';
import { FormattedMessage } from 'react-intl';
import { TrashIcon } from '../../utils/icons/TrashIcon.tsx';

interface Props {
    trackNode: TrackNode;
}

export const TrackNodesNodeSpecCell = ({ trackNode }: Props) => {
    const nodeSpecifications = useSelector(getNodeSpecifications);
    console.log(nodeSpecifications, 'rendered');
    const dispatch = useDispatch();

    if (!nodeSpecifications) {
        return null;
    }
    const segmentId = trackNode.segmentIdAfterNode;
    const foundNodeSpecKey = nodeSpecifications[segmentId];
    const openNodeSpecEditDialog = () => dispatch(nodesActions.setNodeEditInfo({ segmentAfterId: segmentId }));
    const resetNodeSpec = () =>
        dispatch(nodesActions.setNodeSpecification({ segmentAfter: segmentId, nodeSpecs: undefined }));

    if (!foundNodeSpecKey) {
        return (
            <span onClick={openNodeSpecEditDialog}>
                <Button className={'mx-1 rounded-2 p-0'} variant={'success'}>
                    <span className={'mx-1'}>
                        <FormattedMessage id={'msg.add'} />
                    </span>
                    <img src={nodeIcon} alt={'node'} />
                </Button>
            </span>
        );
    }

    return (
        <span>
            <Button className={'mx-1 rounded-2 p-0'} variant={'info'} onClick={openNodeSpecEditDialog}>
                <span className={'mx-1'}>
                    <FormattedMessage id={'msg.nodeSpec'} />
                </span>
                <img src={nodeIcon} alt={'node'} />
            </Button>
            <Button className={'mx-1 rounded-2 p-0'} variant={'danger'} onClick={resetNodeSpec}>
                <span className={'mx-1'}>
                    <FormattedMessage id={'msg.reset'} />
                </span>
                <TrashIcon white={true} />
            </Button>
        </span>
    );
};
