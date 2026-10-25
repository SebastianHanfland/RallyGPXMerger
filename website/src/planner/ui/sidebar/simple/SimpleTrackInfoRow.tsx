import { Col, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { TrackStreetInfo } from '../../../logic/resolving/types';
import { getTimeDifferenceInSeconds } from '../../../../utils/dateUtil';
import { formatFixedNumber } from '../../../../utils/numberUtil';

interface Props {
    trackInfo?: TrackStreetInfo;
}

export const SimpleTrackInfoRow = ({ trackInfo }: Props) => {
    if (!trackInfo) {
        return null;
    }

    const { distanceInKm, startFront, arrivalBack, arrivalFront } = trackInfo;
    const distanceInfo = trackInfo?.distanceInKm ? ` ${formatFixedNumber(trackInfo.distanceInKm, 2)} km` : '';
    const average = (distanceInKm / getTimeDifferenceInSeconds(arrivalFront, startFront)) * 60 * 60;

    const duration = ' ' + formatFixedNumber(getTimeDifferenceInSeconds(arrivalBack, startFront) / 60 / 60, 1) + ' h';

    return (
        <Row>
            <Col>
                <FormattedMessage id={'msg.distance'} />:{distanceInfo}
            </Col>
            <Col>
                <FormattedMessage id={'msg.duration'} />:{duration}
            </Col>
            <Col className={'col-6'}>
                <FormattedMessage id={'msg.averageSpeed'} />:{' ' + formatFixedNumber(average, 1)} km/h
            </Col>
        </Row>
    );
};
