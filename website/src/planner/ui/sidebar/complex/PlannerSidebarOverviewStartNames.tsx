import { Button, Table } from 'react-bootstrap';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { GeoLinkIcon } from '../../../../utils/icons/GeoLinkIcon.tsx';
import { TrackStartName } from '../../../tracks/components/TrackStartName.tsx';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { HighlightUnknown } from '../../../streets/HighlightUnknown.tsx';
import { mapActions } from '../../../store/map.reducer.ts';

export const PlannerSidebarOverviewStartNames = () => {
    const tracks = useSelector(getTrackCompositions);
    const trackInfos = useSelector(getTrackStreetInfos);
    const dispatch = useDispatch();
    const intl = useIntl();
    const unknown = intl.formatMessage({ id: 'msg.unknown' });

    return (
        <Table striped bordered hover style={{ width: '100%' }} size="sm">
            <thead>
                <tr>
                    <th style={{ width: '30%' }}>
                        <FormattedMessage id="msg.trackName" />
                    </th>
                    <th style={{ width: '30%' }}>
                        <FormattedMessage id="msg.publicStart" />
                    </th>
                    <th style={{ width: '40%' }}>
                        <FormattedMessage id="msg.startName" />
                    </th>
                </tr>
            </thead>
            <tbody>
                {tracks.map((track) => {
                    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
                    const firstWayPoint = matchedTrackInfo?.wayPoints[0];
                    const firstStreetName = matchedTrackInfo?.wayPoints[0]?.streetName;
                    const isUnknown = !firstStreetName || firstStreetName === unknown;
                    const originalStartName = isUnknown ? unknown : firstStreetName!;
                    const overwrittenStartName = track.startName?.trim();

                    return (
                        <tr key={track.id}>
                            <td>
                                {firstWayPoint && (
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        title={intl.formatMessage({ id: 'msg.goToStart' })}
                                        aria-label={intl.formatMessage({ id: 'msg.goToStart' })}
                                        onClick={() =>
                                            dispatch(
                                                mapActions.setPointToCenter({
                                                    lat: firstWayPoint.pointFrom.lat,
                                                    lng: firstWayPoint.pointFrom.lon,
                                                })
                                            )
                                        }
                                    >
                                        <GeoLinkIcon />
                                    </Button>
                                )}
                                {track.name || '---'}
                            </td>
                            <td>
                                {overwrittenStartName ? (
                                    <span title={originalStartName} style={{ fontWeight: 'bold' }}>
                                        {track.startName}
                                    </span>
                                ) : (
                                    <HighlightUnknown value={originalStartName} />
                                )}
                            </td>
                            <td>
                                <TrackStartName track={track} />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </Table>
    );
};
