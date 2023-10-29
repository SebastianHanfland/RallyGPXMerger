import './App.css';
import { TrackCompositionSection } from './components/TrackCompositionSection.tsx';
import { FileUploadSection } from './components/FileUploadSection.tsx';
import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { TrackMapPage } from './components/map/TrackMapPage.tsx';
import { TrackMergeSection } from './components/TrackMergeSection.tsx';

export function App() {
    return (
        <Container fluid className={'m-0'}>
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
            <Accordion defaultActiveKey="1" className={'mt-3'}>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Display on Map</Accordion.Header>
                    <Accordion.Body>
                        <TrackMapPage />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
}
