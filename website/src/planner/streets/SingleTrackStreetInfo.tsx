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
import { EditDistrictButton } from './EditDistrictButton.tsx';
import { EditPostCodeButton } from './EditPostCodeButton.tsx';
import { OnlyShowUnknownCheckBox } from './OnlyShowUnknownCheckBox.tsx';
import { wayPointHasUnknown } from './unknownUtil.ts';
import { formatNumber } from '../../utils/numberUtil.ts';

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
            <OnlyShowUnknownCheckBox />
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
                <colgroup>
                    <col span={1} style={{ width: '20%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '12%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '9%' }} />
                    <col span={1} style={{ width: '9%' }} />
                </colgroup>
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
                            <div title={intl.formatMessage({ id: 'msg.duration.hint' })}>
                                <FormattedMessage id={'msg.duration'} />
                                <img src={info} className={'m-1'} alt="help" />
                            </div>
                            <div title={intl.formatMessage({ id: 'msg.blockage.hint' })}>
                                ( <FormattedMessage id={'msg.blockage'} />
                                <img src={info} className={'m-1'} alt="help" />)
                            </div>
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
                        .filter((wayPoint) => (onlyShowUnknown ? wayPointHasUnknown(wayPoint, unknown) : true))
                        .map((waypoint) => {
                            const {
                                streetName,
                                backPassage,
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
                                <tr key={backPassage + streetName + frontArrival + type}>
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
                                        <EditStreetNameButton waypoint={waypoint} />
                                    </td>
                                    <td>
                                        <HighlightUnknown value={postCode?.toString() ?? unknown} />
                                        <EditPostCodeButton waypoint={waypoint} />
                                    </td>
                                    <td>
                                        <HighlightUnknown value={district?.toString() ?? unknown} />
                                        <EditDistrictButton waypoint={waypoint} />
                                    </td>
                                    <td>{formatNumber(distanceInKm ?? 0, 2)} km</td>
                                    <td>{formatNumber(speed ?? 0, 1)} km/h</td>
                                    <td>
                                        {formatNumber(getTimeDifferenceInSeconds(frontPassage, frontArrival) / 60, 1)}{' '}
                                        min (
                                        {formatNumber(getTimeDifferenceInSeconds(backPassage, frontArrival) / 60, 1)}{' '}
                                        min)
                                    </td>
                                    <td>{formatTimeOnly(frontArrival)}</td>
                                    <td>{formatTimeOnly(frontPassage)}</td>
                                    <td>{formatTimeOnly(backPassage)}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </Table>
        </div>
    );
};
