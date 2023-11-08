import { useDispatch, useSelector } from 'react-redux';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getNumberOfPositionsInTracks } from '../map/hooks/trackSimulationReader.ts';
import { Button, ProgressBar, Spinner, Table } from 'react-bootstrap';
import { AppDispatch } from '../../store/store.ts';
import { resolvePositions } from '../../mapMatching/mapMatchingStreetResolver.ts';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { useEffect } from 'react';
import { estimateRequestsForStreetResolving, getRequestProgress } from '../../mapMatching/requestEstimator.ts';
import {
    getIsLoadingGeoData,
    getNumberOfPostCodeRequestsRunning,
    getNumberOfRequestsRunning,
    getNumberOfRequiredRequests,
} from '../../store/geoCodingRequests.reducer.ts';
import { getNumberOfPostCodeRequests, getPostCodeRequestProgress } from '../../mapMatching/postCodeResolver.ts';

export function TrackDataOverview() {
    const calculatedTracks = useSelector(getCalculatedTracks);
    const gpxSegments = useSelector(getGpxSegments);
    const numberOfRequiredRequests = useSelector(getNumberOfRequiredRequests);
    const requestProgress = useSelector(getRequestProgress);
    const runningRequests = useSelector(getNumberOfRequestsRunning) > 0;
    const runningPostCodeRequests = useSelector(getNumberOfPostCodeRequestsRunning) > 0;
    const isLoading = useSelector(getIsLoadingGeoData);
    const numberOfPostCodeRequests = useSelector(getNumberOfPostCodeRequests);
    const postCodeProgress = useSelector(getPostCodeRequestProgress);
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

            <Button
                variant={'success'}
                onClick={() => dispatch(resolvePositions)}
                disabled={runningRequests || runningPostCodeRequests || isLoading}
                title={'Fetching the street information from geoapify and BigDataCloud'}
            >
                {runningRequests || runningPostCodeRequests || isLoading ? (
                    <span>
                        <Spinner size={'sm'} />
                        {runningRequests && <span>Fetching street information</span>}
                        {runningPostCodeRequests && <span>Fetching post codes</span>}
                        {isLoading && !runningRequests && !runningPostCodeRequests && <span>Grouping Streets</span>}
                    </span>
                ) : (
                    <span>Fetch the street information and post codes*</span>
                )}
            </Button>
            <p className={'m-1'} style={{ fontSize: '12px' }}>
                * with clicking, I agree to send data to{' '}
                <a href={'https://www.geoapify.com/'} target={'_blank'} referrerPolicy={'no-referrer'}>
                    geoapify
                </a>{' '}
                and{' '}
                <a href={'https://www.bigdatacloud.com/'} target={'_blank'} referrerPolicy={'no-referrer'}>
                    BigDataCloud
                </a>
            </p>
            <hr />
            <h5>Street information</h5>
            {requestProgress !== undefined && (
                <div className={'m-2'}>
                    <ProgressBar now={requestProgress} label={`${requestProgress?.toFixed(0)}%`}></ProgressBar>
                </div>
            )}
            <h5>Post codes</h5>
            {postCodeProgress !== undefined && (
                <div className={'m-2'}>
                    <ProgressBar now={postCodeProgress} label={`${postCodeProgress?.toFixed(0)}%`}></ProgressBar>
                </div>
            )}
        </div>
    );
}
