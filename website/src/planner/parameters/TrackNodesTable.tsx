import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { trackNodesBySegmentSizeSelector } from '../../common/calculation/nodes/nodeFinder.ts';
import { TrackNodesBranchCell } from './TrackNodesBranchCell.tsx';
import { TrackNodesNodeSpecCell } from './TrackNodesNodeSpecCell.tsx';

export const TrackNodesTable = () => {
    const trackNodes = useSelector(trackNodesBySegmentSizeSelector);
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
                                <TrackNodesNodeSpecCell trackNode={trackNode} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};
