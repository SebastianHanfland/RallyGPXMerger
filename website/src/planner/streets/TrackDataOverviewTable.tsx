import { useSelector } from 'react-redux';
import { getNumberOfPositionsInTracks } from '../map/hooks/trackSimulationReader.ts';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { getNumberOfRequiredRequests } from '../store/geoCodingRequests.reducer.ts';
import { getNumberOfPostCodeRequests } from '../logic/resolving/postcode/postCodeResolver.ts';
import { Table } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';

export function TrackDataOverviewTable() {
    const { uniquePositionCount, unresolvedUniquePositionCount } = useSelector(getNumberOfPositionsInTracks);
    const calculatedTracks = useSelector(getCalculatedTracks);
    const numberOfRequiredRequests = useSelector(getNumberOfRequiredRequests);
    const numberOfPostCodeRequests = useSelector(getNumberOfPostCodeRequests);

    return (
        <Table striped bordered hover style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th>
                        <FormattedMessage id={'msg.property'} />
                    </th>
                    <th>
                        <FormattedMessage id={'msg.value'} />
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        # <FormattedMessage id={'msg.tracks'} />
                    </td>
                    <td>{calculatedTracks.length}</td>
                </tr>
                <tr>
                    <td>
                        # <FormattedMessage id={'msg.uniquePositions'} />
                    </td>
                    <td>{uniquePositionCount}</td>
                </tr>
                <tr>
                    <td>
                        # <FormattedMessage id={'msg.uniquePositions.unresolved'} />
                    </td>
                    <td>{unresolvedUniquePositionCount}</td>
                </tr>
                {numberOfRequiredRequests !== undefined && (
                    <tr>
                        <td>
                            # <FormattedMessage id={'msg.requiredRequests.streets'} />
                        </td>
                        <td>
                            {numberOfRequiredRequests} = {numberOfRequiredRequests * 5} s
                        </td>
                    </tr>
                )}
                {numberOfPostCodeRequests !== undefined && (
                    <tr>
                        <td>
                            # <FormattedMessage id={'msg.requiredRequests.postCodes'} />
                        </td>
                        <td>
                            {numberOfPostCodeRequests} = {(numberOfPostCodeRequests * 0.2).toFixed(1)} s
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}
