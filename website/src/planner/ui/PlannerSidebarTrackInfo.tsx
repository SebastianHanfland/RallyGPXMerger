import { TrackStreetInfo } from '../logic/resolving/types.ts';
import { Row } from 'react-bootstrap';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { useIntl } from 'react-intl';

interface Props {
    trackInfo: TrackStreetInfo | undefined;
}

export const PlannerSidebarTrackInfo = ({ trackInfo }: Props) => {
    const intl = useIntl();
    if (!trackInfo) {
        return null;
    }
    const { distanceInKm, startFront, arrivalBack, arrivalFront } = trackInfo;
    const average = (distanceInKm / getTimeDifferenceInSeconds(arrivalFront, startFront)) * 60 * 60;

    const duration = (getTimeDifferenceInSeconds(arrivalBack, startFront) / 60 / 60).toFixed(1) + ' h';

    return (
        <div className={'mb-3'}>
            <Row>
                <table>
                    <thead>
                        <tr>
                            <th style={{ width: '20%' }}>{intl.formatMessage({ id: 'msg.start' })}</th>
                            <th style={{ width: '20%' }}>{intl.formatMessage({ id: 'msg.arrival' })}</th>
                            <th style={{ width: '20%' }}>{intl.formatMessage({ id: 'msg.end' })}</th>
                            <th style={{ width: '20%' }}>{intl.formatMessage({ id: 'msg.duration' })}</th>
                            <th style={{ width: '20%' }}>{intl.formatMessage({ id: 'msg.averageSpeed' })}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{formatTimeOnly(startFront)}</td>
                            <td>{formatTimeOnly(arrivalFront)}</td>
                            <td>{formatTimeOnly(arrivalBack)}</td>
                            <td>{duration}</td>
                            <td>{average.toFixed(1)} km/h</td>
                        </tr>
                    </tbody>
                </table>
            </Row>
        </div>
    );
};
