import { useDispatch, useSelector } from 'react-redux';
import { layoutActions } from '../../store/layout.reducer.ts';
import { getEnrichedTrackStreetInfos } from '../../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { Button, ProgressBar, Spinner } from 'react-bootstrap';
import { resolvePositions } from '../../logic/resolving/resolveStreetAndPostcodeInfo.ts';
import { AppDispatch } from '../../store/store.ts';
import { calculateTrackStreetInfos } from '../../logic/resolving/aggregate/calculateTrackStreetInfos.ts';
import {
    addPostCodeToStreetInfos,
    getPostCodeRequestProgress,
} from '../../logic/resolving/postcode/postCodeResolver.ts';
import {
    geoCodingRequestsActions,
    getIsAggregating,
    getIsLoadingGeoData,
    getIsLoadingPostCodeData,
    getIsLoadingStreetData,
} from '../../store/geoCodingRequests.reducer.ts';
import { resolveStreetNames } from '../../logic/resolving/streets/mapMatchingStreetResolver.ts';
import { geoCodingActions, getResolvedPositions, getResolvedPostCodes } from '../../store/geoCoding.reducer.ts';
import { Done } from './Done.tsx';
import { Warning } from './Warning.tsx';
import { FormattedMessage } from 'react-intl';
import { getRequestProgress } from '../../logic/resolving/selectors/requestEstimator.ts';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { useEffect } from 'react';
import { gpxSegmentsActions } from '../../store/gpxSegments.reducer.ts';

export function StreetStatus(props: { done: boolean; loading: boolean }) {
    if (props.loading) {
        return <Spinner />;
    }
    if (props.done) {
        return <Done />;
    }
    return <Warning />;
}

export function DashboardStreetsContent({ showClearButton }: { showClearButton?: boolean }) {
    const hasEnrichedTracks = useSelector(getEnrichedTrackStreetInfos).length > 0;
    const postCodes = useSelector(getResolvedPostCodes);
    const resolvedPositions = useSelector(getResolvedPositions);
    const hasStreetInfo = Object.values(resolvedPositions).filter((value) => value !== null).length > 0;
    const hasPostCodeInfo = Object.values(postCodes).filter((value) => value !== null).length > 0;
    const dispatch: AppDispatch = useDispatch();

    const isLoading = useSelector(getIsLoadingGeoData);
    const isAggregating = useSelector(getIsAggregating);
    const isLoadingStreetData = useSelector(getIsLoadingStreetData);
    const isLoadingPostCodeData = useSelector(getIsLoadingPostCodeData);

    const requestProgress = useSelector(getRequestProgress);
    const postCodeProgress = useSelector(getPostCodeRequestProgress);

    useEffect(() => {
        if (requestProgress === 100) {
            dispatch(geoCodingRequestsActions.setIsLoadingStreetData(false));
        }
    }, [requestProgress]);

    useEffect(() => {
        if (postCodeProgress === 100) {
            dispatch(geoCodingRequestsActions.setIsLoadingPostCodeData(false));
        }
    }, [postCodeProgress]);

    const streetsDone = requestProgress === 100 && hasStreetInfo;
    const postCodesDone = postCodeProgress === 100 && hasPostCodeInfo;

    const ongoingRequests = isLoading || isAggregating;

    const hasNoTrack = useSelector(getCalculatedTracks).length === 0;

    return (
        <div>
            <div className={'d-flex justify-content-between m-1'}>
                <b>
                    <FormattedMessage id={'msg.externalInfo'} />
                </b>
                <Button
                    size={'sm'}
                    variant={'success'}
                    onClick={(event) => {
                        event.stopPropagation();
                        dispatch(layoutActions.selectSection('streets'));
                        resolvePositions && dispatch(resolvePositions);
                    }}
                    disabled={ongoingRequests || hasNoTrack}
                >
                    <FormattedMessage id={'msg.triggerAll'} /> *
                </Button>
            </div>
            <div className={'d-flex justify-content-between m-1'}>
                <Button
                    size={'sm'}
                    disabled={ongoingRequests || hasNoTrack}
                    onClick={(event) => {
                        event.stopPropagation();
                        dispatch(layoutActions.selectSection('streets'));
                        dispatch(resolveStreetNames);
                    }}
                >
                    <FormattedMessage id={'msg.streetNames'} /> *
                </Button>
                {showClearButton && (
                    <Button
                        size={'sm'}
                        onClick={(event) => {
                            event.stopPropagation();
                            dispatch(geoCodingActions.clearStreetNames());
                            dispatch(gpxSegmentsActions.setAllSegmentsToUnresolved());
                        }}
                        variant={'danger'}
                        disabled={ongoingRequests || hasNoTrack}
                    >
                        <FormattedMessage id={'msg.clearStreetNames'} />
                    </Button>
                )}
                <StreetStatus done={streetsDone} loading={isLoadingStreetData} />
            </div>
            {requestProgress !== undefined && (
                <div className={'m-2'}>
                    <ProgressBar now={requestProgress} label={`${requestProgress?.toFixed(0)}%`}></ProgressBar>
                </div>
            )}
            <div className={'d-flex justify-content-between m-1'}>
                <Button
                    size={'sm'}
                    onClick={(event) => {
                        event.stopPropagation();
                        dispatch(layoutActions.selectSection('streets'));
                        dispatch(calculateTrackStreetInfos);
                    }}
                    disabled={ongoingRequests || hasNoTrack}
                >
                    <FormattedMessage id={'msg.aggregation'} />
                </Button>
                <StreetStatus done={hasEnrichedTracks} loading={isAggregating} />
            </div>
            <div className={'d-flex justify-content-between m-1'}>
                <Button
                    size={'sm'}
                    onClick={(event) => {
                        event.stopPropagation();
                        dispatch(layoutActions.selectSection('streets'));
                        dispatch(addPostCodeToStreetInfos);
                    }}
                    disabled={ongoingRequests || hasNoTrack}
                >
                    <FormattedMessage id={'msg.postCodes'} /> *
                </Button>
                {showClearButton && (
                    <Button
                        size={'sm'}
                        onClick={(event) => {
                            event.stopPropagation();
                            dispatch(geoCodingActions.clearPostCodesAndDistricts());
                        }}
                        variant={'danger'}
                        disabled={ongoingRequests || hasNoTrack}
                    >
                        <FormattedMessage id={'msg.clearPostCodes'} />
                    </Button>
                )}
                <StreetStatus done={postCodesDone} loading={isLoadingPostCodeData} />
            </div>
            {postCodeProgress !== undefined && (
                <div className={'m-2'}>
                    <ProgressBar now={postCodeProgress} label={`${postCodeProgress?.toFixed(0)}%`}></ProgressBar>
                </div>
            )}
            <p className={'m-1'} style={{ fontSize: '12px' }}>
                *<FormattedMessage id={'msg.iAgree.part1'} />{' '}
                <a href={'https://www.geoapify.com/'} target={'_blank'} referrerPolicy={'no-referrer'}>
                    geoapify
                </a>{' '}
                <FormattedMessage id={'msg.iAgree.part2'} />{' '}
                <a href={'https://www.bigdatacloud.com/'} target={'_blank'} referrerPolicy={'no-referrer'}>
                    BigDataCloud
                </a>
                <FormattedMessage id={'msg.iAgree.part3'} />
            </p>
        </div>
    );
}
