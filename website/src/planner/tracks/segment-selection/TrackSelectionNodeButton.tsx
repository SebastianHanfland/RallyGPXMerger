import { useDispatch, useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { listAllNodesOfTracks, NodeAtTrack } from '../../../common/calculation/nodes/nodeFinder.ts';
import { TrackComposition } from '../../store/types.ts';
import { nodesActions } from '../../store/nodes.reducer.ts';
import { NodeIcon } from '../../../utils/icons/NodeIcon.tsx';

interface Props {
    segmentId: string;
}

function getTracksAtNode(foundNode: NodeAtTrack, trackCompositions: TrackComposition[]): TrackComposition[] {
    return trackCompositions.filter((track) =>
        track.segments.map((segment) => segment.id).includes(foundNode.segmentIdAfterNode)
    );
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
            onClick={() => dispatch(nodesActions.setNodeEditInfo({ segmentAfterId: segmentId }))}
        >
            <span className={'mx-1'}>
                <NodeIcon />
            </span>
            <FormattedMessage id={'msg.nodePoint'} values={{ counter: foundNode.segmentsBeforeNode.length }} />
        </span>
    );
}
