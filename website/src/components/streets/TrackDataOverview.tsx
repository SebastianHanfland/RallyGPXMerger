import { useDispatch, useSelector } from 'react-redux';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getNumberOfPositionsInTracks } from '../map/hooks/trackSimulationReader.ts';
import { Button, ProgressBar, Table } from 'react-bootstrap';
import { AppDispatch } from '../../store/store.ts';
import { resolvePositions } from '../../mapMatching/mapMatchingStreetResolver.ts';

export function TrackDataOverview() {
    const calculatedTracks = useSelector(getCalculatedTracks);
    const dispatch: AppDispatch = useDispatch();

    const { positionCount, uniquePositionCount, unresolvedUniquePositionCount } =
        useSelector(getNumberOfPositionsInTracks);

    return (
        <div className={'m-2 p-2'}>
            <h4>Overview of calculated Data</h4>
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
                </tbody>
            </Table>

            <Button onClick={() => dispatch(resolvePositions)}>Trigger the calculation</Button>
            <div className={'m-2'}>
                <ProgressBar now={10} label={`${10}%`}></ProgressBar>
            </div>
        </div>
    );
}
