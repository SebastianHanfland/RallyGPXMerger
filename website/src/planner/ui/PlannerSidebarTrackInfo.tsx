import { TrackStreetInfo } from '../logic/resolving/types.ts';
import { Col, Row } from 'react-bootstrap';
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
                <Col>
                    {intl.formatMessage({ id: 'msg.start' })}: {formatTimeOnly(startFront)}
                </Col>
                <Col>
                    {intl.formatMessage({ id: 'msg.arrival' })}: {formatTimeOnly(arrivalFront)}
                </Col>
                <Col>
                    {intl.formatMessage({ id: 'msg.end' })}: {formatTimeOnly(arrivalBack)}
                </Col>
                <Col>
                    {intl.formatMessage({ id: 'msg.duration' })}: {duration}
                </Col>
                <Col>
                    {intl.formatMessage({ id: 'msg.averageSpeed' })}: {average.toFixed(1)} km/h
                </Col>
            </Row>
        </div>
    );
};
