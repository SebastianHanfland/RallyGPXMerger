import { TrackStreetInfo, TrackWayPointType } from '../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { Table } from 'react-bootstrap';
import { StreetMapLink } from './StreetMapLink.tsx';
import { HighlightUnknown } from './HighlightUnknown.tsx';
import info from '../../assets/info.svg';
import { useSelector } from 'react-redux';
import { getOnlyShowUnknown } from '../store/geoCoding.reducer.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { EditStreetNameButton } from './EditStreetNameButton.tsx';

interface Props {
    trackStreetInfo: TrackStreetInfo;
}

export const SingleTrackStreetInfo = ({ trackStreetInfo }: Props) => {
    const intl = useIntl();
    const onlyShowUnknown = useSelector(getOnlyShowUnknown);
    const { name, wayPoints, distanceInKm, startFront, arrivalBack, arrivalFront, peopleCount } = trackStreetInfo;
    const average = (distanceInKm / getTimeDifferenceInSeconds(arrivalFront, startFront)) * 60 * 60;
    const unknown = intl.formatMessage({ id: 'msg.unknown' });
    return (
        <div>
            <h5>{name}</h5>
            <div className={'d-flex justify-content-between'}>
                <div className={'m-3'}>{`${intl.formatMessage({ id: 'msg.distance' })}: ${distanceInKm.toFixed(
                    2
                )} km`}</div>
                <div className={'m-3'}>{`${intl.formatMessage({ id: 'msg.start' })}: ${formatTimeOnly(
                    startFront
                )}`}</div>
                <div className={'m-3'}>{`${intl.formatMessage({ id: 'msg.arrival' })}: ${formatTimeOnly(
                    arrivalFront
                )}`}</div>
                <div className={'m-3'}>{`${intl.formatMessage({ id: 'msg.end' })}: ${formatTimeOnly(
                    arrivalBack
                )}`}</div>
                <div className={'m-3'}>{`${intl.formatMessage({ id: 'msg.averageSpeed' })}: ${average.toFixed(
                    1
                )} km/h`}</div>
                <div className={'m-3'}>{`#${intl.formatMessage({ id: 'msg.people' })}: ${peopleCount ?? '---'}`}</div>
            </div>
            <Table striped bordered hover style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th>
                            <FormattedMessage id={'msg.street'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.postCode'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.district'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.length'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.speed'} />
                        </th>
                        <th>
                            <span title={intl.formatMessage({ id: 'msg.duration.hint' })}>
                                <FormattedMessage id={'msg.duration'} />
                                <img src={info} className={'m-1'} alt="help" />
                            </span>{' '}
                            <span title={intl.formatMessage({ id: 'msg.blockage.hint' })}>
                                ( <FormattedMessage id={'msg.blockage'} />
                                <img src={info} className={'m-1'} alt="help" />)
                            </span>
                        </th>
                        <th>
                            <FormattedMessage id={'msg.arrivalOfFront'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.passageOfFront'} />
                        </th>
                        <th>
                            <FormattedMessage id={'msg.passageOfBack'} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {wayPoints
                        .filter((wayPoint) =>
                            onlyShowUnknown
                                ? wayPoint.streetName === unknown ||
                                  !wayPoint.streetName ||
                                  wayPoint.postCode === undefined ||
                                  wayPoint.district === undefined
                                : true
                        )
                        .map((waypoint) => {
                            const {
                                streetName,
                                backArrival,
                                frontArrival,
                                frontPassage,
                                postCode,
                                district,
                                pointTo,
                                pointFrom,
                                type,
                                breakLength,
                                nodeTracks,
                                distanceInKm,
                                speed,
                            } = waypoint;
                            return (
                                <tr key={backArrival + streetName + frontArrival}>
                                    <td>
                                        <HighlightUnknown value={streetName ?? unknown} />
                                        <StreetMapLink pointTo={pointTo} pointFrom={pointFrom} />
                                        <b>
                                            {type === TrackWayPointType.Break
                                                ? `Pause${breakLength ? ` (${breakLength} min)` : ''}`
                                                : null}
                                        </b>
                                        <b>
                                            {type === TrackWayPointType.Node
                                                ? `Knoten${nodeTracks ? ':  ' + nodeTracks.join(', ') : ''}`
                                                : null}
                                        </b>
                                        <EditStreetNameButton
                                            waypoint={waypoint}
                                            trackStreetInfoId={trackStreetInfo.id}
                                        />
                                    </td>
                                    <td>
                                        <HighlightUnknown value={postCode?.toString() ?? unknown} />
                                    </td>
                                    <td>
                                        <HighlightUnknown value={district?.toString() ?? unknown} />
                                    </td>
                                    <td>{(distanceInKm ?? 0).toFixed(2)} km</td>
                                    <td>{(speed ?? 0).toFixed(1)} km/h</td>
                                    <td>
                                        {(getTimeDifferenceInSeconds(frontPassage, frontArrival) / 60).toFixed(1)} min (
                                        {(getTimeDifferenceInSeconds(backArrival, frontArrival) / 60).toFixed(1)} min)
                                    </td>
                                    <td>{formatTimeOnly(frontArrival)}</td>
                                    <td>{formatTimeOnly(frontPassage)}</td>
                                    <td>{formatTimeOnly(backArrival)}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};
