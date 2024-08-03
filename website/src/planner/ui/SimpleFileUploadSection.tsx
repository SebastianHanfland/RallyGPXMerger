import { SimpleGpxSegments } from './SimpleGpxSegments.tsx';
import { PlannerSidebarTrackInfo } from './PlannerSidebarTrackInfo.tsx';
import { useSelector } from 'react-redux';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { getEnrichedTrackStreetInfos } from '../logic/resolving/selectors/getEnrichedTrackStreetInfos.ts';
import { Col, Row } from 'react-bootstrap';
import { TrackName } from './TrackName.tsx';
import { ArrivalDateTimePicker } from '../parameters/ArrivalDateTimePicker.tsx';
import { TrackPeople } from './TrackPeople.tsx';
import { AverageSpeedSetter } from '../parameters/AverageSpeedSetter.tsx';
import { ParticipantsDelaySetter } from '../parameters/ParticipantsDelaySetter.tsx';
import { TrackInfoDownloadButtons } from './TrackInfoDownloadButtons.tsx';

export function SimpleFileUploadSection() {
    const trackCompositions = useSelector(getTrackCompositions);
    const trackInfos = useSelector(getEnrichedTrackStreetInfos);
    if (trackCompositions.length === 0) {
        return null;
    }
    const track = trackCompositions[0];
    const matchedTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
    const distanceInfo = matchedTrackInfo?.distanceInKm ? ` (${matchedTrackInfo.distanceInKm.toFixed(2)} km)` : '';
    return (
        <div className={'p-2 shadow'} style={{ overflow: 'auto', height: '100vh' }}>
            <h4>
                <Row>
                    <h5>Route</h5>
                    <Col>
                        <span style={{ width: '300px' }}>
                            <TrackName track={track} />
                        </span>
                    </Col>
                    <Col>
                        <span className={'mx-2'}>{`${distanceInfo}`}</span>
                    </Col>
                </Row>
            </h4>

            <Row>
                <Col>
                    <TrackPeople track={track} />
                </Col>
                <Col>
                    <ArrivalDateTimePicker noHeader={true} />
                </Col>
            </Row>

            <div className={'my-3'}>
                <PlannerSidebarTrackInfo trackInfo={matchedTrackInfo} />
            </div>
            <Row>
                <Col>
                    <AverageSpeedSetter />
                </Col>
                <Col>
                    <ParticipantsDelaySetter />
                </Col>
            </Row>
            <hr />
            <TrackInfoDownloadButtons />
            <SimpleGpxSegments />
            <div style={{ height: '250px' }} />
        </div>
    );
}
