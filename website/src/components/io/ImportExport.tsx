import { Accordion, Col, Row } from 'react-bootstrap';
import { FileUploadSection } from '../segments/FileUploadSection.tsx';
import { TrackCompositionSection } from '../tracks/TrackCompositionSection.tsx';
import { TrackMergeSection } from '../parameters/TrackMergeSection.tsx';

export function ImportExport() {
    return (
        <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
                <Accordion.Header>Merging GPX Segments to Tracks</Accordion.Header>
                <Accordion.Body>
                    <Row className="flex-xl-nowrap" style={{ height: '60vh', width: '100%' }}>
                        <Col xl={4}>
                            <FileUploadSection />
                        </Col>
                        <Col xl={5}>
                            <TrackCompositionSection />
                        </Col>
                        <Col xl={3}>
                            <TrackMergeSection />
                        </Col>
                    </Row>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}
