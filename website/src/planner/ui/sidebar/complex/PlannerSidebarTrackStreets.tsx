import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { TrackComposition } from '../../../store/types.ts';
import { TrackWayPointType } from '../../../logic/resolving/types.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { mapActions } from '../../../store/map.reducer.ts';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { formatNumber } from '../../../../utils/numberUtil.ts';

interface Props {
    track: TrackComposition;
}

export const PlannerSidebarTrackStreets = ({ track }: Props) => {
    const trackStreetInfo = useSelector(getTrackStreetInfos).find((trackInfo) => trackInfo.id === track.id);
    const dispatch = useDispatch();

    const getStreetPath = (wayPoint: NonNullable<typeof trackStreetInfo>['wayPoints'][number]) =>
        wayPoint.path ?? [
            { lat: wayPoint.pointFrom.lat, lon: wayPoint.pointFrom.lon },
            { lat: wayPoint.pointTo.lat, lon: wayPoint.pointTo.lon },
        ];

    const highlightStreetPath = (wayPoint: NonNullable<typeof trackStreetInfo>['wayPoints'][number]) => {
        dispatch(mapActions.setHighlightedStreetPath(getStreetPath(wayPoint)));
    };

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
                        <div className={'d-flex align-items-center'}>
                            <Button
                                type={'button'}
                                size={'sm'}
                                variant={'outline-secondary'}
                                onClick={() => {
                                    highlightStreetPath(wayPoint);
                                    dispatch(
                                        mapActions.setPointToCenter({
                                            lat: wayPoint.pointFrom.lat,
                                            lng: wayPoint.pointFrom.lon,
                                        })
                                    );
                                }}
                            >
                                <FormattedMessage id={'msg.start'} />
                            </Button>
                            <Button
                                type={'button'}
                                size={'sm'}
                                variant={'outline-secondary'}
                                onClick={() => {
                                    highlightStreetPath(wayPoint);
                                    dispatch(
                                        mapActions.setPointToCenter({
                                            lat: wayPoint.pointTo.lat,
                                            lng: wayPoint.pointTo.lon,
                                        })
                                    );
                                }}
                            >
                                <FormattedMessage id={'msg.end'} />
                            </Button>

                            <button
                                type={'button'}
                                className={'flex-grow-1'}
                                style={{ cursor: 'pointer', border: 0, background: 'transparent' }}
                                onClick={() => {
                                    highlightStreetPath(wayPoint);
                                    dispatch(
                                        mapActions.setPointToCenter({
                                            lat: (wayPoint.pointFrom.lat + wayPoint.pointTo.lat) / 2,
                                            lng: (wayPoint.pointFrom.lon + wayPoint.pointTo.lon) / 2,
                                        })
                                    );
                                }}
                            >
                                {wayPoint.streetName ?? <FormattedMessage id={'msg.unknown'} />}{' '}
                                <FormattedMessage
                                    id={'msg.streetDetails'}
                                    values={{
                                        points: getStreetPath(wayPoint).length,
                                        distance: formatNumber(wayPoint.distanceInKm ?? 0, 2),
                                    }}
                                />
                            </button>
                        </div>
                    </li>
                ))}
        </ul>
    );
};
