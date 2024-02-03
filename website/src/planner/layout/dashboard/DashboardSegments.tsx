import { DashboardCard } from './Dashboard.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { getArrivalDateTime } from '../../store/trackMerge.reducer.ts';
import { layoutActions } from '../../store/layout.reducer.ts';

export function DashboardSegments() {
    const hasSegments = useSelector(getGpxSegments).length > 0;
    const hasArrivalData = !!useSelector(getArrivalDateTime);
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(layoutActions.selectSection('gps'));
        dispatch(layoutActions.setShowDashboard(false));
    };

    return <DashboardCard text={'Segments'} done={hasSegments} canBeDone={hasArrivalData} onClick={onClick} />;
}
