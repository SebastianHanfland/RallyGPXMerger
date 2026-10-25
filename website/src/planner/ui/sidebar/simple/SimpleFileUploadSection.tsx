import { SimpleGpxSegments } from './SimpleGpxSegments.tsx';
import { PlannerSidebarTrackInfo } from '../PlannerSidebarTrackInfo.tsx';
import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { Col, Row } from 'react-bootstrap';
import { ArrivalDateTimePicker } from '../../../parameters/ArrivalDateTimePicker.tsx';
import { TrackPeople } from '../../../tracks/components/TrackPeople.tsx';
import { AverageSpeedSetter } from '../../../parameters/AverageSpeedSetter.tsx';
import { ParticipantsDelaySetter } from '../../../parameters/ParticipantsDelaySetter.tsx';
import { TrackStreetInfoButton } from '../../../tracks/components/TrackStreetInfoButton.tsx';
import { FormattedMessage } from 'react-intl';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';
import { StartDateTimePicker } from '../../../parameters/StartDateTimePicker.tsx';
import { TrackButtonsCell } from '../../../tracks/TrackButtonsCell.tsx';
import { PlanningTitle } from '../../../parameters/PlanningTitle.tsx';
import { getArrivalDateTime, getHasDefaultArrivalDateTime, getPlanningTitle } from '../../../store/settings.reducer.ts';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';

export function SimpleFileUploadSection() {
    const trackCompositions = useSelector(getTrackCompositions);
    const trackInfos = useSelector(getTrackStreetInfos);
    const gpxSegments = useSelector(getParsedGpxSegments);
    if (trackCompositions.length === 0) {
        return null;
    }
    const track = trackCompositions[0];
    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
    const distanceInfo = matchedTrackInfo?.distanceInKm ? ` (${matchedTrackInfo.distanceInKm.toFixed(2)} km)` : '';
    const planningTitle = useSelector(getPlanningTitle);
    const arrivalDateTime = useSelector(getArrivalDateTime);
    const hasDefaultArrivalDateTime = useSelector(getHasDefaultArrivalDateTime);

    return (
        <div className={'p-2 shadow'} style={{ overflow: 'auto', height: '100vh' }}>
            <Row>
                <div>
                    <PlanningTitle setTrackNameAsWell={true} />
                </div>
            </Row>
            {planningTitle && (
                <>
                    <hr />
                    <Row>
                        <Col>
                            <StartDateTimePicker />
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
                    <PlannerSidebarTrackInfo trackInfo={matchedTrackInfo} />
                    <TrackStreetInfoButton matchedTrackInfo={matchedTrackInfo} />
                    {distanceInfo && <span>{distanceInfo}</span>}
                    <TrackButtonsCell track={track} single={true} />
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
