import { DashboardCard } from './Dashboard.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { layoutActions } from '../../store/layout.reducer.ts';
import { getEnrichedTrackStreetInfos } from '../../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import check from '../../../assets/check-circle.svg';
import { Button } from 'react-bootstrap';
import { resolvePositions } from '../../logic/resolving/resolveStreetAndPostcodeInfo.ts';
import { AppDispatch } from '../../store/store.ts';
import { calculateTrackStreetInfos } from '../../logic/resolving/aggregate/calculateTrackStreetInfos.ts';
import { addPostCodeToStreetInfos } from '../../logic/resolving/postcode/postCodeResolver.ts';
import {
    getIsLoadingGeoData,
    getNumberOfPostCodeRequestsRunning,
    getNumberOfRequestsRunning,
} from '../../store/geoCodingRequests.reducer.ts';
import { resolveStreetNames } from '../../logic/resolving/streets/mapMatchingStreetResolver.ts';
import { geoCodingActions } from '../../store/geoCoding.reducer.ts';

export function DashboardStreets() {
    const hasMergedTracks = useSelector(getCalculatedTracks).length > 0;
    const hasEnrichedTracks = useSelector(getEnrichedTrackStreetInfos).length > 0;
    const dispatch: AppDispatch = useDispatch();

    const runningRequests = useSelector(getNumberOfRequestsRunning) > 0;
    const runningPostCodeRequests = useSelector(getNumberOfPostCodeRequestsRunning) > 0;
    const isLoading = useSelector(getIsLoadingGeoData);

    const ongoingRequests = runningRequests || runningPostCodeRequests || isLoading;

    const done = true;
    const onClick = (thunk: any) => () => {
        dispatch(layoutActions.selectSection('streets'));
        dispatch(layoutActions.setShowDashboard(false));
        dispatch(thunk);
    };
    return (
        <DashboardCard text={''} done={hasEnrichedTracks} canBeDone={hasMergedTracks} childrenOnly={true}>
            <div>
                <div className={'d-flex justify-content-between m-1'}>
                    <b>External info</b>
                    <Button size={'sm'} onClick={onClick(resolvePositions)} disabled={ongoingRequests}>
                        Trigger All
                    </Button>
                </div>
                <div className={'d-flex justify-content-between m-1'}>
                    <Button size={'sm'} disabled={ongoingRequests} onClick={onClick(resolveStreetNames)}>
                        Street Info
                    </Button>
                    {done && <img src={check} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />}
                </div>
                <div className={'d-flex justify-content-between m-1'}>
                    <Button size={'sm'} onClick={onClick(calculateTrackStreetInfos)} disabled={ongoingRequests}>
                        Aggregation
                    </Button>
                    {done && <img src={check} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />}
                </div>
                <div className={'d-flex justify-content-between m-1'}>
                    <Button
                        size={'sm'}
                        onClick={() => {
                            dispatch(layoutActions.selectSection('streets'));
                            dispatch(layoutActions.setShowDashboard(false));
                            dispatch(geoCodingActions.clearPostCodesAndDistricts());
                            dispatch(addPostCodeToStreetInfos);
                        }}
                        disabled={ongoingRequests}
                    >
                        PostCodes
                    </Button>
                    {done && <img src={check} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />}
                </div>
            </div>
        </DashboardCard>
    );
}
