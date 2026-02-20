import { SimpleGpxSegments } from './SimpleGpxSegments.tsx';
import { PlannerSidebarTrackInfo } from '../PlannerSidebarTrackInfo.tsx';
import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { Col, Row } from 'react-bootstrap';
import { TrackName } from '../../../tracks/components/TrackName.tsx';
import { ArrivalDateTimePicker } from '../../../parameters/ArrivalDateTimePicker.tsx';
import { TrackPeople } from '../../../tracks/components/TrackPeople.tsx';
import { AverageSpeedSetter } from '../../../parameters/AverageSpeedSetter.tsx';
import { ParticipantsDelaySetter } from '../../../parameters/ParticipantsDelaySetter.tsx';
import { TrackInfoDownloadButtons } from '../../../tracks/components/TrackInfoDownloadButtons.tsx';
import { FormattedMessage } from 'react-intl';
import { BlockTextDescription } from '../../../../utils/layout/BlockTextDescription.tsx';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';
import { getTrackStreetInfos } from '../../../logic/resolving/aggregate/calculateTrackStreetInfosWithBreaksAndNodes.ts';

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

    if (gpxSegments.length === 0) {
        return (
            <div className={'p-2 shadow'} style={{ overflow: 'auto', height: '100vh' }}>
                <SimpleGpxSegments />
                <div style={{ height: '250px' }} />
            </div>
        );
    }

    return (
        <div className={'p-2 shadow'} style={{ overflow: 'auto', height: '100vh' }}>
            <div>
                <Row>
                    <h5>
                        <FormattedMessage id={'msg.track'} />
                        {distanceInfo && <span>{distanceInfo}</span>}
                    </h5>
                    <BlockTextDescription messageId={'msg.description.simpleTracks'} />

                    <Col>
                        <h6>
                            <FormattedMessage id={'msg.trackName'} />
                        </h6>
                        <TrackName track={track} />
                    </Col>
                    <Col>
                        <h6>
                            <FormattedMessage id={'msg.trackPeople'} />
                        </h6>
                        <TrackPeople track={track} />
                    </Col>
                    <Col>
                        <ArrivalDateTimePicker />
                    </Col>
                </Row>
            </div>

            <Row></Row>

            <div className={'my-3'}>
                <PlannerSidebarTrackInfo trackInfo={matchedTrackInfo} />
            </div>
            <hr />
            <Row>
                <Col>
                    <AverageSpeedSetter slim={true} />
                </Col>
                <Col>
                    <ParticipantsDelaySetter slim={true} />
                </Col>
            </Row>
            <hr />
            <TrackInfoDownloadButtons matchedTrackInfo={matchedTrackInfo} />
            <SimpleGpxSegments />
            <div style={{ height: '250px' }} />
        </div>
    );
}
