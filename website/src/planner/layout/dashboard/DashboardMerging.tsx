import { MergeTracksButton } from '../../tracks/MergeTracksButton.tsx';
import { DashboardCard } from './Dashboard.tsx';
import { useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';

export function DashboardMerging() {
    const hasSegments = useSelector(getGpxSegments).length > 0;
    const hasTracks = useSelector(getTrackCompositions).length > 0;
    const hasMergedTracks = useSelector(getCalculatedTracks).length > 0;
    return (
        <DashboardCard text={'Tracks Merging'} done={hasMergedTracks} canBeDone={hasTracks && hasSegments}>
            <MergeTracksButton />
        </DashboardCard>
    );
}
