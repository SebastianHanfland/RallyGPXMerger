import { useDispatch, useSelector } from 'react-redux';
import { layoutActions } from '../../store/layout.reducer.ts';
import { StreetFilesPdfMakeDownloader } from '../../streets/StreetFilesPdfMakeDownloader.tsx';
import { getEnrichedTrackStreetInfos } from '../../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { DashboardCard } from './DashboardCard.tsx';
import { useIntl } from 'react-intl';

export function DashboardDocuments() {
    const dispatch = useDispatch();
    const hasAggregatedStreets = useSelector(getEnrichedTrackStreetInfos).length > 0;
    const intl = useIntl();

    const onClick = () => {
        dispatch(layoutActions.selectSection('importExport'));
        dispatch(layoutActions.setShowDashboard(false));
    };
    return (
        <DashboardCard
            text={intl.formatMessage({ id: 'msg.documents' })}
            done={false}
            canBeDone={hasAggregatedStreets}
            onClick={onClick}
        >
            {hasAggregatedStreets && <StreetFilesPdfMakeDownloader />}
        </DashboardCard>
    );
}