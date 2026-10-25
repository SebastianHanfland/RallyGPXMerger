import { TrackStreetInfo } from '../../logic/resolving/types';
import { Row } from 'react-bootstrap';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil';
import { FormattedMessage, useIntl } from 'react-intl';
import { formatFixedNumber } from '../../../utils/numberUtil';

interface Props {
    trackInfo: TrackStreetInfo | undefined;
}

export const PlannerSidebarTrackInfo = ({ trackInfo }: Props) => {
    const intl = useIntl();
    if (!trackInfo) {
        return null;
    }
    const { distanceInKm, startFront, publicStart, arrivalBack, arrivalFront } = trackInfo;
    const average = (distanceInKm / getTimeDifferenceInSeconds(arrivalFront, startFront)) * 60 * 60;

    const duration = formatFixedNumber(getTimeDifferenceInSeconds(arrivalBack, startFront) / 60 / 60, 1) + ' h';

    return (
        <div className={'mb-3'}>
            <Row>
                <table>
                    <thead>
                        <tr>
                            <th>{intl.formatMessage({ id: 'msg.duration' })}</th>
                            <th>{intl.formatMessage({ id: 'msg.averageSpeed' })}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{duration}</td>
                            <td>{formatFixedNumber(average, 1)} km/h</td>
                        </tr>
                    </tbody>
                </table>
                <h4>
                    <FormattedMessage id={'msg.times'} />
                </h4>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '16.666%' }}>{intl.formatMessage({ id: 'msg.publicStart' })}</th>
                            <th style={{ width: '16.666%' }}>{intl.formatMessage({ id: 'msg.start' })}</th>
                            <th style={{ width: '16.666%' }}>{intl.formatMessage({ id: 'msg.arrival' })}</th>
                            <th style={{ width: '16.666%' }}>{intl.formatMessage({ id: 'msg.end' })}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{publicStart ? formatTimeOnly(publicStart) : ''}</td>
                            <td>{formatTimeOnly(startFront)}</td>
                            <td>{formatTimeOnly(arrivalFront)}</td>
                            <td>{formatTimeOnly(arrivalBack)}</td>
                        </tr>
                    </tbody>
                </table>
            </Row>
        </div>
    );
};
