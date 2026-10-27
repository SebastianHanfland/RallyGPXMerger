import { SimpleGpxSegments } from './SimpleGpxSegments';
import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../../store/trackMerge.reducer';
import { Col, Row } from 'react-bootstrap';
import { ArrivalDateTimePicker } from '../../../parameters/ArrivalDateTimePicker';
import { TrackPeople } from '../../../tracks/components/TrackPeople';
import { AverageSpeedSetter } from '../../../parameters/AverageSpeedSetter';
import { ParticipantsDelaySetter } from '../../../parameters/ParticipantsDelaySetter';
import { FormattedMessage } from 'react-intl';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos';
import { StartDateTimePicker } from '../../../parameters/StartDateTimePicker';
import { PlanningTitle } from '../../../parameters/PlanningTitle';
import { getArrivalDateTime, getHasDefaultArrivalDateTime, getPlanningTitle } from '../../../store/settings.reducer';
import { getParsedGpxSegments } from '../../../store/segmentData.redux';
import { TrackBuffer } from '../../../tracks/components/TrackBuffer';
import { SimpleTrackInfoRow } from './SimpleTrackInfoRow';
import { SimplePlanningChecks } from './checks/SimplePlanningChecks';

export function SimpleFileUploadSection() {
    const trackCompositions = useSelector(getTrackCompositions);
    const trackInfos = useSelector(getTrackStreetInfos);
    const gpxSegments = useSelector(getParsedGpxSegments);
    if (trackCompositions.length === 0) {
        return null;
    }
    const track = trackCompositions[0];
    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
    const planningTitle = useSelector(getPlanningTitle);
    const arrivalDateTime = useSelector(getArrivalDateTime);
    const hasDefaultArrivalDateTime = useSelector(getHasDefaultArrivalDateTime);

    return (
        <div className={'p-2 shadow'} style={{ overflow: 'auto', height: '100vh' }}>
            <Row>
                <div>
                    <PlanningTitle setTrackNameAsWell={true} singleTrack={track} />
                </div>
            </Row>
            <SimpleTrackInfoRow trackInfo={matchedTrackInfo} />
            {planningTitle && (
                <>
                    <hr />
                    <Row>
                        <Col>
                            <StartDateTimePicker />
                        </Col>
                        <Col>
                            <h6>
                                <FormattedMessage id="msg.buffer" />
                            </h6>
                            <TrackBuffer track={track} />
                        </Col>
                        <Col>
                            <ArrivalDateTimePicker />
                        </Col>
                        <Col>
                            <h6>
                                <FormattedMessage id={'msg.trackPeople'} />
                            </h6>
                            <TrackPeople track={track} />
                        </Col>
                    </Row>
                    <Row className={'mt-4'}>
                        <Col>
                            <AverageSpeedSetter slim={true} />
                        </Col>
                        <Col>
                            <ParticipantsDelaySetter slim={true} />
                        </Col>
                    </Row>
                </>
            )}
            {gpxSegments.length > 0 && (
                <>
                    <hr />
                    <SimplePlanningChecks matchedTrackInfo={matchedTrackInfo} />
                </>
            )}
            {!hasDefaultArrivalDateTime && arrivalDateTime && (
                <>
                    <hr />
                    <SimpleGpxSegments />
                </>
            )}
            <div style={{ height: '250px' }} />
        </div>
    );
}
