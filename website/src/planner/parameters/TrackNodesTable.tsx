import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { trackNodesBySegmentSizeSelector } from '../../common/calculation/nodes/nodeFinder.ts';
import { getNodeSpecifications } from '../store/nodes.reducer.ts';
import { TrackNodesBranchCell } from './TrackNodesBranchCell.tsx';

export const TrackNodesTable = () => {
    const trackNodes = useSelector(trackNodesBySegmentSizeSelector);
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
                                <TrackNodesBranchCell trackNode={trackNode} />
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
