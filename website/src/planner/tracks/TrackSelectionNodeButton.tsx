import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getNodePositions } from '../logic/resolving/selectors/getNodePositions.ts';
import nodeIcon from '../../assets/mergeTracks.svg';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';

interface Props {
    segmentId: string;
}

export function TrackSelectionNodeButton({ segmentId }: Props) {
    const dispatch = useDispatch();
    const nodes = useSelector(getNodePositions);
    const foundNode = nodes.find((node) => node.segmentIdAfter === segmentId);

    if (!foundNode) {
        return null;
    }

    return (
        <span
            title={foundNode.tracks.join('\n')}
            style={{ backgroundColor: 'white', padding: '5px' }}
            className={'rounded-2'}
            onClick={() => dispatch(trackMergeActions.setNodeEditInfo({ segmentAfterId: segmentId }))}
        >
            <span className={'mx-1'}>
                <img src={nodeIcon} alt={'node'} />
            </span>
            <FormattedMessage id={'msg.nodePoint'} values={{ counter: foundNode.tracks.length }} />
        </span>
    );
}
