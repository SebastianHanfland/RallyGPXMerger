import '../App.css';
import { TrackCompositionSection } from './tracks/TrackCompositionSection.tsx';
import { FileUploadSection } from './segments/FileUploadSection.tsx';
import { Accordion, Col, Container, Row } from 'react-bootstrap';
import { StreetResolvingSection } from './streets/StreetResolvingSection.tsx';
import { ImportExport } from './io/ImportExport.tsx';
import { parseCalculatedTracksHook } from './map/hooks/parseCalculatedTracksHook.ts';
import { PlainMap } from './map/PlainMap.tsx';
import { MapToolbar } from './map/MapToolbar.tsx';

export function MergeAndMap() {
    parseCalculatedTracksHook();

    return (
        <Container fluid className={'m-0'}>
            <ImportExport />
            <Accordion defaultActiveKey="0" className={'mt-3'}>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Merging GPX Segments to Tracks</Accordion.Header>
                    <Accordion.Body>
                        <Row className="flex-xl-nowrap" style={{ height: '60vh', width: '100%' }}>
                            <Col xl={4}>
                                <FileUploadSection />
                            </Col>
                            <Col xl={4}>
                                <TrackCompositionSection />
                            </Col>
                            <Col xl={4}>
                                <div style={{ height: '45vh' }}>
                                    <PlainMap />
                                </div>
                                <div style={{ height: '20%' }}>
                                    <MapToolbar />
                                </div>
                            </Col>
                        </Row>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <Accordion defaultActiveKey="1" className={'mt-3'}>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Resolve the streets</Accordion.Header>
                    <Accordion.Body>
                        <StreetResolvingSection />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
}
