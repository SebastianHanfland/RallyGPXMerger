import { Col, Row } from 'react-bootstrap';
import { TrackMergeSection } from '../../components/parameters/TrackMergeSection.tsx';
import { SegmentSpeedSettings } from './SegmentSpeedSettings.tsx';
import { ConstructionSites } from './ConstructionSites.tsx';

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
                    <ConstructionSites />
                </Col>
            </Row>
        </div>
    );
}
