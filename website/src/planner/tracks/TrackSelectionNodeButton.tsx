import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import nodeIcon from '../../assets/mergeTracks.svg';
import { getTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { listAllNodesOfTracks } from '../logic/calculate/helper/nodeFinder.ts';
import { getTracksAtNode } from '../nodes/getInitialOffsetForNodeInfo.tsx';

interface Props {
    segmentId: string;
}

export function TrackSelectionNodeButton({ segmentId }: Props) {
    const dispatch = useDispatch();
    const tracks = useSelector(getTrackCompositions);
    const trackNodes = listAllNodesOfTracks(tracks);
    const foundNode = trackNodes.find((node) => node.segmentIdAfterNode === segmentId);

    if (!foundNode) {
        return null;
    }

    const tracksAtNode = getTracksAtNode(foundNode, tracks);

    return (
        <span
            title={tracksAtNode.map((track) => track.name).join('\n')}
            style={{ backgroundColor: 'white', padding: '5px' }}
            className={'rounded-2'}
            onClick={() => dispatch(trackMergeActions.setNodeEditInfo({ segmentAfterId: segmentId }))}
        >
            <span className={'mx-1'}>
                <img src={nodeIcon} alt={'node'} />
            </span>
            <FormattedMessage id={'msg.nodePoint'} values={{ counter: foundNode.segmentsBeforeNode.length }} />
        </span>
    );
}
