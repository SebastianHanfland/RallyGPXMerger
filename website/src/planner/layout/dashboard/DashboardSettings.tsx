import { DashboardCard } from './Dashboard.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getArrivalDateTime } from '../../store/trackMerge.reducer.ts';
import { layoutActions } from '../../store/layout.reducer.ts';

export function DashboardSettings() {
    const hasArrivalData = !!useSelector(getArrivalDateTime);
    const dispatch = useDispatch();
    const onClick = () => {
        dispatch(layoutActions.selectSection('settings'));
        dispatch(layoutActions.setShowDashboard(false));
    };

    return <DashboardCard text={'Settings'} done={hasArrivalData} canBeDone={true} onClick={onClick} />;
}
