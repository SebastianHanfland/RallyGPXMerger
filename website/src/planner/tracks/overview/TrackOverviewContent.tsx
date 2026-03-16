import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { TrackSegmentSelectionMinimum } from './TrackSegmentSelectionMinimum.tsx';

export const TrackOverviewContent = () => {
    const tracks = useSelector(getTrackCompositions);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'flex-end' }}>
            {tracks.map((track) => {
                return (
                    <div style={{ width: '100px', alignContent: 'end' }}>
                        <TrackSegmentSelectionMinimum track={track} />
                    </div>
                );
            })}
        </div>
    );
};
