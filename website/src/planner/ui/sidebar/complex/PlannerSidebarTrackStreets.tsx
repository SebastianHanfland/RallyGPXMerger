import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { TrackComposition } from '../../../store/types.ts';
import { TrackWayPointType } from '../../../logic/resolving/types.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';

interface Props {
    track: TrackComposition;
}

export const PlannerSidebarTrackStreets = ({ track }: Props) => {
    const trackStreetInfo = useSelector(getTrackStreetInfos).find((trackInfo) => trackInfo.id === track.id);

    return (
        <ul>
            {trackStreetInfo?.wayPoints
                .filter((wayPoint) => wayPoint.type === TrackWayPointType.Track)
                .map((wayPoint, index) => (
                    <li key={`${wayPoint.s ?? 'street'}-${index}`}>
                        {wayPoint.streetName ?? <FormattedMessage id={'msg.unknown'} />}
                    </li>
                ))}
        </ul>
    );
};
