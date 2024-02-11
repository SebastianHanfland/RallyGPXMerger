import { useDispatch, useSelector } from 'react-redux';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { layoutActions } from '../../store/layout.reducer.ts';
import { getEnrichedTrackStreetInfos } from '../../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { Spinner } from 'react-bootstrap';
import { AppDispatch } from '../../store/store.ts';
import { Done } from './Done.tsx';
import { DashboardCard } from './DashboardCard.tsx';
import { Warning } from './Warning.tsx';
import { DashboardStreetsContent } from './DashboardStreetsContent.tsx';

export function StreetStatus(props: { done: boolean; loading: boolean }) {
    if (props.loading) {
        return <Spinner />;
    }
    if (props.done) {
        return <Done />;
    }
    return <Warning />;
}

export function DashboardStreets() {
    const hasMergedTracks = useSelector(getCalculatedTracks).length > 0;
    const hasEnrichedTracks = useSelector(getEnrichedTrackStreetInfos).length > 0;
    const dispatch: AppDispatch = useDispatch();

    return (
        <DashboardCard
            text={''}
            done={hasEnrichedTracks}
            canBeDone={hasMergedTracks}
            childrenOnly={true}
            onClick={() => {
                dispatch(layoutActions.selectSection('streets'));
                dispatch(layoutActions.setShowDashboard(false));
            }}
        >
            <DashboardStreetsContent />
        </DashboardCard>
    );
}
