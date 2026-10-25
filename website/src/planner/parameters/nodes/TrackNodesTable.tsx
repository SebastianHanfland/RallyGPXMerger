import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { trackNodesBySegmentSizeSelector } from '../../../common/calculation/nodes/nodeFinder';
import { TrackNodesBranchCell } from './TrackNodesBranchCell';
import { TrackNodesNodeSpecCell } from './TrackNodesNodeSpecCell';
import { ResetAllNodeSpecsButton } from './ResetAllNodeSpecsButton';
import { NodeOverviewButton } from './NodeOverviewButton';
import { TrackNodeType } from './TrackNodeType';
import { NodeDescriptionInfo } from '../../ui/sidebar/complex/NodeDescriptionInfo';

export const TrackNodesTable = () => {
    const trackNodes = useSelector(trackNodesBySegmentSizeSelector);
    return (
        <div>
            <div className="d-flex align-items-center justify-content-between mb-2">
                <h5 className="mb-0">
                    <FormattedMessage id="msg.nodes.specificBehavior" />
                </h5>
                <NodeDescriptionInfo />
            </div>
            <Table striped bordered hover style={{ width: '100%' }} size="sm">
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id={'msg.branches'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.type'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.customBehavior'} />
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
                                <TrackNodeType trackNode={trackNode} />
                            </td>
                            <td>
                                <TrackNodesNodeSpecCell trackNode={trackNode} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div>
                <ResetAllNodeSpecsButton />
                <NodeOverviewButton />
            </div>
        </div>
    );
};
