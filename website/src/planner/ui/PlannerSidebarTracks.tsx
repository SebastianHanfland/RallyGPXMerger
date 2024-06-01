import { TrackSelectionCell } from '../tracks/TrackSelectionCell.tsx';
import { TrackButtonsCell } from '../tracks/TrackButtonsCell.tsx';
import { useSelector } from 'react-redux';
import { getFilteredTrackCompositions } from '../store/trackMerge.reducer.ts';

export const PlannerSidebarTracks = () => {
    const trackCompositions = useSelector(getFilteredTrackCompositions);

    return (
        <div>
            <div style={{ width: '100%' }}>
                <TrackSelectionCell track={trackCompositions[0]} />
            </div>
            <div>
                <TrackButtonsCell track={trackCompositions[0]} />
            </div>
        </div>
    );
};
