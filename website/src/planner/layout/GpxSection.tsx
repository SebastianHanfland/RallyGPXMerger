import { Col, Row } from 'react-bootstrap';
import { FileUploadSection } from '../segments/FileUploadSection.tsx';
import { TrackCompositionSection } from '../tracks/TrackCompositionSection.tsx';
import { PlainMap } from '../map/PlainMap.tsx';
import { MapToolbar } from '../map/MapToolbar.tsx';

export function GpxSection() {
    return (
        <Row className="flex-xl-nowrap" style={{ height: '80vh', width: '100%' }}>
            <Col xxl={3} xl={4} lg={12}>
                <FileUploadSection />
            </Col>
            <Col xl={4} lg={12}>
                <TrackCompositionSection />
            </Col>
            <Col xxl={5} xl={4} lg={12}>
                <div style={{ height: '65vh' }}>
                    <PlainMap />
                </div>
                <div style={{ height: '10%' }} className={'mt-1'}>
                    <MapToolbar />
                </div>
            </Col>
        </Row>
    );
}
