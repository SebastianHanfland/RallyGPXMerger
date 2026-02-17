import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getNodePositions } from '../logic/resolving/selectors/getNodePositions.ts';
import nodeIcon from '../../assets/mergeTracks.svg';

interface Props {
    segmentId: string;
}

export function TrackSelectionNodeButton({ segmentId }: Props) {
    const nodes = useSelector(getNodePositions);
    const isNode = nodes.find((node) => node.segmentIdAfter === segmentId);

    if (!isNode) {
        return null;
    }

    return (
        <span
            title={isNode.tracks.join('\n')}
            style={{ backgroundColor: 'white', padding: '5px' }}
            className={'rounded-2'}
        >
            <span className={'mx-1'}>
                <img src={nodeIcon} alt={'node'} />
            </span>
            <FormattedMessage id={'msg.nodePoint'} values={{ counter: isNode.tracks.length }} />
        </span>
    );
}
