import { useDispatch, useSelector } from 'react-redux';
import { layoutActions } from '../../store/layout.reducer.ts';
import { getEnrichedTrackStreetInfos } from '../../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { Button, Spinner } from 'react-bootstrap';
import { resolvePositions } from '../../logic/resolving/resolveStreetAndPostcodeInfo.ts';
import { AppDispatch } from '../../store/store.ts';
import { calculateTrackStreetInfos } from '../../logic/resolving/aggregate/calculateTrackStreetInfos.ts';
import { addPostCodeToStreetInfos } from '../../logic/resolving/postcode/postCodeResolver.ts';
import {
    getIsAggregating,
    getIsLoadingGeoData,
    getNumberOfPostCodeRequestsRunning,
    getNumberOfRequestsRunning,
} from '../../store/geoCodingRequests.reducer.ts';
import { resolveStreetNames } from '../../logic/resolving/streets/mapMatchingStreetResolver.ts';
import { geoCodingActions, getResolvedPositions, getResolvedPostCodes } from '../../store/geoCoding.reducer.ts';
import { Done } from './Done.tsx';
import { Warning } from './Warning.tsx';
import { FormattedMessage } from 'react-intl';

export function StreetStatus(props: { done: boolean; loading: boolean }) {
    if (props.loading) {
        return <Spinner />;
    }
    if (props.done) {
        return <Done />;
    }
    return <Warning />;
}

export function DashboardStreetsContent() {
    const hasEnrichedTracks = useSelector(getEnrichedTrackStreetInfos).length > 0;
    const postCodes = useSelector(getResolvedPostCodes);
    const resolvedPositions = useSelector(getResolvedPositions);
    const hasStreetInfo = Object.values(resolvedPositions).filter((value) => value !== null).length > 0;
    const hasPostCodeInfo = Object.values(postCodes).filter((value) => value !== null).length > 0;
    const dispatch: AppDispatch = useDispatch();

    const runningRequests = useSelector(getNumberOfRequestsRunning) > 0;
    const runningPostCodeRequests = useSelector(getNumberOfPostCodeRequestsRunning) > 0;
    const isLoading = useSelector(getIsLoadingGeoData);
    const isAggregating = useSelector(getIsAggregating);

    const streetsDone = !runningRequests && hasStreetInfo;
    const postCodesDone = !runningPostCodeRequests && hasPostCodeInfo;

    const ongoingRequests = runningRequests || runningPostCodeRequests || isLoading || isAggregating;

    return (
        <div>
            <div className={'d-flex justify-content-between m-1'}>
                <b>
                    <FormattedMessage id={'msg.externalInfo'} />
                </b>
                <Button
                    size={'sm'}
                    onClick={(event) => {
                        event.stopPropagation();
                        dispatch(layoutActions.selectSection('streets'));
                        resolvePositions && dispatch(resolvePositions);
                    }}
                    disabled={ongoingRequests}
                >
                    <FormattedMessage id={'msg.triggerAll'} />
                </Button>
            </div>
            <div className={'d-flex justify-content-between m-1'}>
                <Button
                    size={'sm'}
                    disabled={ongoingRequests}
                    onClick={(event) => {
                        event.stopPropagation();
                        dispatch(layoutActions.selectSection('streets'));
                        dispatch(resolveStreetNames);
                    }}
                >
                    <FormattedMessage id={'msg.streetNames'} />
                </Button>
                <StreetStatus done={streetsDone} loading={runningRequests} />
            </div>
            <div className={'d-flex justify-content-between m-1'}>
                <Button
                    size={'sm'}
                    onClick={(event) => {
                        event.stopPropagation();
                        dispatch(layoutActions.selectSection('streets'));
                        dispatch(calculateTrackStreetInfos);
                    }}
                    disabled={ongoingRequests}
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
                        dispatch(geoCodingActions.clearPostCodesAndDistricts());
                        dispatch(addPostCodeToStreetInfos);
                    }}
                    disabled={ongoingRequests}
                >
                    <FormattedMessage id={'msg.postCodes'} />
                </Button>
                <StreetStatus done={postCodesDone} loading={runningPostCodeRequests} />
            </div>
        </div>
    );
}
