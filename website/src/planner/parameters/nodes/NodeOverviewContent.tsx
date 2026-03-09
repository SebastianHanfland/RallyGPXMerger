import { useSelector } from 'react-redux';
import { getDelaysOfTracksSelector } from '../../../common/calculation/calculated-tracks/getSpecifiedDelayPerTrack.ts';

export const NodeOverviewContent = () => {
    const delaysOfTracks = useSelector(getDelaysOfTracksSelector);

    return <>{JSON.stringify(delaysOfTracks)}</>;
};
