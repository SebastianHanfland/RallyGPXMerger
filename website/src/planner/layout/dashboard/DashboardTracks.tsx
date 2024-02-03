import { DashboardCard } from './Dashboard.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { layoutActions } from '../../store/layout.reducer.ts';

export function DashboardTracks() {
    const hasSegments = useSelector(getGpxSegments).length > 0;
    const hasTracks = useSelector(getTrackCompositions).length > 0;
    const dispatch = useDispatch();

    const onClick = () => {
        dispatch(layoutActions.selectSection('gps'));
        dispatch(layoutActions.setShowDashboard(false));
    };
    return <DashboardCard text={'Tracks'} done={hasTracks} canBeDone={hasSegments} onClick={onClick} />;
}
