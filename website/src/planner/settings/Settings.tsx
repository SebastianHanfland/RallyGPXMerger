import { Col, Row } from 'react-bootstrap';
import { TrackMergeParameters } from '../parameters/TrackMergeParameters.tsx';
import { SegmentSpeedSettings } from './SegmentSpeedSettings.tsx';
import { ConstructionSites } from './ConstructionSites.tsx';

export function Settings() {
    return (
        <div>
            <h3 className={'mb-5'}>Settings</h3>
            <Row className="flex-xl-nowrap" style={{ height: '80vh', width: '100%' }}>
                <Col xl={4}>
                    <TrackMergeParameters />
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
