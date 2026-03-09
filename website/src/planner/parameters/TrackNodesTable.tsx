import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useSelector } from 'react-redux';
import { ColorBlob } from '../../utils/ColorBlob.tsx';
import { getColor } from '../../utils/colorUtil.ts';
import { trackNodesBySegmentSizeSelector } from '../../common/calculation/nodes/nodeFinder.ts';
import { getNodeSpecifications } from '../store/nodes.reducer.ts';

export const TrackNodesTable = () => {
    const trackNodes = useSelector(trackNodesBySegmentSizeSelector);
    const tracks = useSelector(getTrackCompositions);
    const nodeSpecifications = useSelector(getNodeSpecifications);
    return (
        <div>
            <Table striped bordered hover style={{ width: '100%' }} size="sm">
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id={'msg.trackName'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.trackPeople'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {trackNodes.map((trackNode) => (
                        <tr key={trackNode.segmentIdAfterNode}>
                            <td>
                                {trackNode.segmentsBeforeNode.map((segmentBefore) => {
                                    const foundTrack = tracks.find((track) => track.id === segmentBefore.trackId);
                                    const color = getColor(foundTrack ?? { id: segmentBefore.trackId });
                                    return <ColorBlob color={color} />;
                                })}
                            </td>
                            <td>
                                {nodeSpecifications &&
                                    Object.keys(nodeSpecifications).find(
                                        (nodeSpec) => nodeSpec === trackNode.segmentIdAfterNode
                                    ) && <div>NodeSpec</div>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
