import { useDispatch, useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { getArrivalDateTime } from '../../store/trackMerge.reducer.ts';
import { layoutActions } from '../../store/layout.reducer.ts';
import { DashboardCard } from './DashboardCard.tsx';
import { useIntl } from 'react-intl';

export function DashboardSegments() {
    const hasSegments = useSelector(getGpxSegments).length > 0;
    const hasArrivalData = !!useSelector(getArrivalDateTime);
    const dispatch = useDispatch();
    const intl = useIntl();

    const onClick = () => {
        dispatch(layoutActions.selectSection('gps'));
        dispatch(layoutActions.setShowDashboard(false));
    };

    return (
        <DashboardCard
            text={intl.formatMessage({ id: 'msg.segments' })}
            done={hasSegments}
            canBeDone={hasArrivalData}
            onClick={onClick}
        />
    );
}
