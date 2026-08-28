import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { TrackComposition } from '../../../store/types.ts';
import { TrackWayPointType } from '../../../logic/resolving/types.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { mapActions } from '../../../store/map.reducer.ts';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

interface Props {
    track: TrackComposition;
}

export const PlannerSidebarTrackStreets = ({ track }: Props) => {
    const trackStreetInfo = useSelector(getTrackStreetInfos).find((trackInfo) => trackInfo.id === track.id);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(mapActions.setHighlightedStreetPath(undefined));
        };
    }, [dispatch]);

    return (
        <ul data-testid={'track-street-list'}>
            {trackStreetInfo?.wayPoints
                .filter((wayPoint) => wayPoint.type === TrackWayPointType.Track)
                .map((wayPoint, index) => (
                    <li key={`${wayPoint.s ?? 'street'}-${index}`}>
                        <button
                            type={'button'}
                            style={{ cursor: 'pointer', border: 0, background: 'transparent' }}
                            onClick={() => {
                                const path = wayPoint.path ?? [
                                    { lat: wayPoint.pointFrom.lat, lon: wayPoint.pointFrom.lon },
                                    { lat: wayPoint.pointTo.lat, lon: wayPoint.pointTo.lon },
                                ];
                                dispatch(mapActions.setHighlightedStreetPath(path));
                                if (path.length > 0) {
                                    dispatch(mapActions.setPointToCenter({ lat: path[0].lat, lng: path[0].lon }));
                                }
                            }}
                        >
                            {wayPoint.streetName ?? <FormattedMessage id={'msg.unknown'} />}
                        </button>
                    </li>
                ))}
        </ul>
    );
};
