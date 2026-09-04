import { useSelector } from 'react-redux';
import { TrackStartName } from '../../../tracks/components/TrackStartName.tsx';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';

export const PlannerSidebarOverviewStartNames = () => {
    const tracks = useSelector(getTrackCompositions);

    return (
        <>
            {tracks.map((track) => (
                <div className="mb-2" key={track.id}>
                    <label className="form-label">{track.name || '---'}</label>
                    <TrackStartName track={track} />
                </div>
            ))}
        </>
    );
};
