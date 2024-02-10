import { useDispatch, useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { layoutActions } from '../../store/layout.reducer.ts';
import { DashboardCard } from './DashboardCard.tsx';
import { useIntl } from 'react-intl';

export function DashboardTracks() {
    const hasSegments = useSelector(getGpxSegments).length > 0;
    const hasTracks = useSelector(getTrackCompositions).length > 0;
    const dispatch = useDispatch();
    const intl = useIntl();

    const onClick = () => {
        dispatch(layoutActions.selectSection('gps'));
        dispatch(layoutActions.setShowDashboard(false));
    };
    return (
        <DashboardCard
            text={intl.formatMessage({ id: 'msg.tracks' })}
            done={hasTracks}
            canBeDone={hasSegments}
            onClick={onClick}
        />
    );
}
