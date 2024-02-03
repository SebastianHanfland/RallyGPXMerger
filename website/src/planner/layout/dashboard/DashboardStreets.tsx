import { DashboardCard } from './Dashboard.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { layoutActions } from '../../store/layout.reducer.ts';
import { getEnrichedTrackStreetInfos } from '../../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import check from '../../../assets/check-circle.svg';

export function DashboardStreets() {
    const hasMergedTracks = useSelector(getCalculatedTracks).length > 0;
    const hasCalulatedStreets = useSelector(getEnrichedTrackStreetInfos).length > 0;
    const dispatch = useDispatch();
    const done = true;
    const onClick = () => {
        dispatch(layoutActions.selectSection('streets'));
        dispatch(layoutActions.setShowDashboard(false));
    };
    return (
        <DashboardCard
            text={''}
            done={hasCalulatedStreets}
            canBeDone={hasMergedTracks}
            onClick={onClick}
            childrenOnly={true}
        >
            <div>
                <h6>External info</h6>
                <div className={'d-flex justify-content-between'}>
                    Street Info
                    {done && <img src={check} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />}
                </div>
                <div className={'d-flex justify-content-between'}>
                    Aggregation
                    {done && <img src={check} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />}
                </div>
                <div className={'d-flex justify-content-between'}>
                    Post codes
                    {done && <img src={check} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />}
                </div>
            </div>
        </DashboardCard>
    );
}
