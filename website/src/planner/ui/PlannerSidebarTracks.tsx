import { useSelector } from 'react-redux';
import { getFilteredTrackCompositions } from '../store/trackMerge.reducer.ts';
import { PlannerSidebarTrackDetails } from './PlannerSidebarTrackDetails.tsx';

export const PlannerSidebarTracks = () => {
    const trackCompositions = useSelector(getFilteredTrackCompositions);

    const track = trackCompositions[0];
    return <PlannerSidebarTrackDetails track={track} />;
};
