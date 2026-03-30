import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { TrackSegmentSelectionMinimum } from './TrackSegmentSelectionMinimum.tsx';
import { isTrackSegment, TrackComposition } from '../../store/types.ts';
import { FormattedMessage } from 'react-intl';

const getSegmentIds = (track: TrackComposition) => {
    return track.segments
        .filter(isTrackSegment)
        .reverse()
        .map((segment) => segment.id)
        .join();
};
export const TrackOverviewContent = () => {
    const tracks = useSelector(getTrackCompositions);
    const sortedTracks = [...tracks].sort((a, b) => (getSegmentIds(a) > getSegmentIds(b) ? 1 : -1));

    return (
        <div>
            <FormattedMessage id={'msg.trackOverview.description'} />
            <div style={{ display: 'flex', flexDirection: 'row', alignContent: 'flex-end' }}>
                {sortedTracks.map((track) => {
                    return (
                        <div style={{ width: '100px', alignContent: 'end' }} key={track.id}>
                            <TrackSegmentSelectionMinimum track={track} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
