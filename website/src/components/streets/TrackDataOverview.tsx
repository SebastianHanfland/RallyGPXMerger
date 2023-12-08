import { useDispatch, useSelector } from 'react-redux';
import { Button, ProgressBar, Spinner } from 'react-bootstrap';
import { AppDispatch } from '../../store/store.ts';
import { resolvePositions } from '../../mapMatching/mapMatchingStreetResolver.ts';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { useEffect } from 'react';
import { estimateRequestsForStreetResolving, getRequestProgress } from '../../mapMatching/requestEstimator.ts';
import {
    getIsLoadingGeoData,
    getNumberOfPostCodeRequestsRunning,
    getNumberOfRequestsRunning,
} from '../../store/geoCodingRequests.reducer.ts';
import { addPostCodeToStreetInfos, getPostCodeRequestProgress } from '../../mapMatching/postCodeResolver.ts';
import { TrackDataOverviewTable } from './TrackDataOverviewTable.tsx';
import { geoCodingActions, getResolvedPostCodes } from '../../store/geoCoding.reducer.ts';

export function TrackDataOverview() {
    const gpxSegments = useSelector(getGpxSegments);
    const requestProgress = useSelector(getRequestProgress);
    const runningRequests = useSelector(getNumberOfRequestsRunning) > 0;
    const runningPostCodeRequests = useSelector(getNumberOfPostCodeRequestsRunning) > 0;
    const isLoading = useSelector(getIsLoadingGeoData);
    const postCodeProgress = useSelector(getPostCodeRequestProgress);
    const hasNoPostCodes = Object.keys(useSelector(getResolvedPostCodes)).length === 0;
    const dispatch: AppDispatch = useDispatch();

    useEffect(() => {
        dispatch(estimateRequestsForStreetResolving);
    }, [gpxSegments.length]);

    const ongoingRequests = runningRequests || runningPostCodeRequests || isLoading;
    return (
        <div className={'m-2 p-2'}>
            <h4>Overview of calculated Data</h4>
            <TrackDataOverviewTable />

            <Button
                variant={'success'}
                onClick={() => dispatch(resolvePositions)}
                disabled={ongoingRequests}
                title={'Fetching the street information from geoapify and BigDataCloud'}
            >
                {ongoingRequests ? (
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
            <Button variant={'success'} onClick={() => dispatch(addPostCodeToStreetInfos)} disabled={ongoingRequests}>
                Fetch Postcodes
            </Button>
            <Button
                className={'mx-1'}
                variant={'danger'}
                onClick={() => dispatch(geoCodingActions.clearPostCodesAndDistricts())}
                disabled={hasNoPostCodes || ongoingRequests}
            >
                Clear Postcodes
            </Button>
            {postCodeProgress !== undefined && (
                <div className={'m-2'}>
                    <ProgressBar now={postCodeProgress} label={`${postCodeProgress?.toFixed(0)}%`}></ProgressBar>
                </div>
            )}
        </div>
    );
}
