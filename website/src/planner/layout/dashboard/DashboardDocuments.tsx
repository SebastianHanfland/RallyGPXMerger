import { useDispatch, useSelector } from 'react-redux';
import { layoutActions } from '../../store/layout.reducer.ts';
import { StreetFilesPdfMakeDownloader } from '../../streets/StreetFilesPdfMakeDownloader.tsx';
import { DashboardCard } from './Dashboard.tsx';
import { getEnrichedTrackStreetInfos } from '../../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';

export function DashboardDocuments() {
    const dispatch = useDispatch();
    const hasAggregatedStreets = useSelector(getEnrichedTrackStreetInfos).length > 0;

    const onClick = () => {
        dispatch(layoutActions.selectSection('importExport'));
        dispatch(layoutActions.setShowDashboard(false));
    };
    return (
        <DashboardCard text={'Documents'} done={false} canBeDone={hasAggregatedStreets} onClick={onClick}>
            {hasAggregatedStreets && <StreetFilesPdfMakeDownloader />}
        </DashboardCard>
    );
}
