import { useSelector } from 'react-redux';
import { getNumberOfPositionsInTracks } from '../map/hooks/trackSimulationReader.ts';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getNumberOfRequiredRequests } from '../../store/geoCodingRequests.reducer.ts';
import { getNumberOfPostCodeRequests } from '../../mapMatching/postCodeResolver.ts';
import { Table } from 'react-bootstrap';

export function TrackDataOverviewTable() {
    const { positionCount, uniquePositionCount, unresolvedUniquePositionCount } =
        useSelector(getNumberOfPositionsInTracks);
    const calculatedTracks = useSelector(getCalculatedTracks);
    const numberOfRequiredRequests = useSelector(getNumberOfRequiredRequests);
    const numberOfPostCodeRequests = useSelector(getNumberOfPostCodeRequests);

    return (
        <Table striped bordered hover style={{ width: '100%' }}>
            <thead>
                <tr>
                    <th>Property</th>
                    <th>Value</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td># Tracks</td>
                    <td>{calculatedTracks.length}</td>
                </tr>
                <tr>
                    <td># Positions</td>
                    <td>{positionCount}</td>
                </tr>
                <tr>
                    <td># Unique positions</td>
                    <td>{uniquePositionCount}</td>
                </tr>
                <tr>
                    <td># Unresolved unique Positions</td>
                    <td>{unresolvedUniquePositionCount}</td>
                </tr>
                {!!numberOfRequiredRequests && (
                    <tr>
                        <td># required street Requests</td>
                        <td>
                            {numberOfRequiredRequests} = {numberOfRequiredRequests * 5} s
                        </td>
                    </tr>
                )}
                {numberOfPostCodeRequests > 0 && (
                    <tr>
                        <td># required Post code Requests</td>
                        <td>
                            {numberOfPostCodeRequests} = {(numberOfPostCodeRequests * 0.2).toFixed(1)} s
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}
