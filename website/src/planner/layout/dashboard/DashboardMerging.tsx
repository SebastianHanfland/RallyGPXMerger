import { MergeTracksButton } from '../../tracks/MergeTracksButton.tsx';
import { DashboardCard } from './Dashboard.tsx';
import { useSelector } from 'react-redux';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { CalculatedFilesDownloader } from '../../tracks/CalculatedFilesDownloader.tsx';
import check from '../../../assets/check-circle.svg';

export function DashboardMerging() {
    const hasSegments = useSelector(getGpxSegments).length > 0;
    const hasTracks = useSelector(getTrackCompositions).length > 0;
    const hasMergedTracks = useSelector(getCalculatedTracks).length > 0;
    return (
        <DashboardCard text={''} done={hasMergedTracks} canBeDone={hasTracks && hasSegments} childrenOnly={true}>
            <div>
                <div className={'d-flex justify-content-between'}>
                    <b>Tracks Merging</b>
                    {hasMergedTracks && (
                        <img src={check} className="m-1" alt="trash" style={{ width: '20px', height: '20px' }} />
                    )}
                </div>
                <div className={'my-2 d-flex justify-content-between'}>
                    <MergeTracksButton />
                    {hasMergedTracks && <CalculatedFilesDownloader />}
                </div>
            </div>
        </DashboardCard>
    );
}
