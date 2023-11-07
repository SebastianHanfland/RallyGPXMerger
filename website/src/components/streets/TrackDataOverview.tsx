import { useDispatch, useSelector } from 'react-redux';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getNumberOfPositionsInTracks } from '../map/hooks/trackSimulationReader.ts';
import { Button, ProgressBar, Spinner, Table } from 'react-bootstrap';
import { AppDispatch } from '../../store/store.ts';
import { resolvePositions } from '../../mapMatching/mapMatchingStreetResolver.ts';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { useEffect } from 'react';
import { estimateRequestsForStreetResolving, getRequestProgress } from '../../mapMatching/requestEstimator.ts';
import { getNumberOfRequestsRunning, getNumberOfRequiredRequests } from '../../store/geoCoding.reducer.ts';

export function TrackDataOverview() {
    const calculatedTracks = useSelector(getCalculatedTracks);
    const gpxSegments = useSelector(getGpxSegments);
    const numberOfRequiredRequests = useSelector(getNumberOfRequiredRequests);
    const requestProgress = useSelector(getRequestProgress);
    const runningRequests = useSelector(getNumberOfRequestsRunning) > 0;
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(estimateRequestsForStreetResolving);
    }, [gpxSegments.length]);

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
                    {numberOfRequiredRequests && (
                        <tr>
                            <td># required Requests</td>
                            <td>
                                {numberOfRequiredRequests} = {numberOfRequiredRequests * 5} s
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Button onClick={() => dispatch(resolvePositions)} disabled={runningRequests}>
                {runningRequests ? (
                    <span>
                        <Spinner size={'sm'} />
                        Fetching
                    </span>
                ) : (
                    <span>Fetch the street information</span>
                )}
            </Button>
            {requestProgress !== undefined && (
                <div className={'m-2'}>
                    <ProgressBar now={requestProgress} label={`${requestProgress?.toFixed(0)}%`}></ProgressBar>
                </div>
            )}
        </div>
    );
}
