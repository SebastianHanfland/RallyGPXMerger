import { Col, Row } from 'react-bootstrap';
import { GpxSegments } from '../segments/GpxSegments.tsx';
import { TrackMergeSection } from '../parameters/TrackMergeSection.tsx';
import { SegmentSpeedSettings } from './SegmentSpeedSettings.tsx';

export function Settings() {
    return (
        <div>
            <h3 className={'mb-5'}>Settings</h3>
            <Row className="flex-xl-nowrap" style={{ height: '80vh', width: '100%' }}>
                <Col xl={4}>
                    <TrackMergeSection />
                </Col>
                <Col xl={4}>
                    <SegmentSpeedSettings />
                </Col>
                <Col xl={4}>
                    <h3>Blocked roads to display</h3>
                    <GpxSegments />
                </Col>
            </Row>
        </div>
    );
}
