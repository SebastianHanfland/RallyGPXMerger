import { useSelector } from 'react-redux';
import { getTrackStreetInfo } from '../../mapMatching/getTrackStreetInfo.ts';
import { SingleTrackStreetInfo } from './TrackStreetInfo.tsx';

export function ProofOfConcept() {
    const trackStreetInfos = useSelector(getTrackStreetInfo);

    return (
        <div>
            <h3>Track Street Info</h3>
            <div>
                {trackStreetInfos.map((trackStreetInfo) => (
                    <SingleTrackStreetInfo trackStreetInfo={trackStreetInfo} />
                ))}
            </div>
        </div>
    );
}
