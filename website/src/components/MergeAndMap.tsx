import '../App.css';
import { TrackCompositionSection } from './tracks/TrackCompositionSection.tsx';
import { FileUploadSection } from './segments/FileUploadSection.tsx';
import { Col, Container, Row } from 'react-bootstrap';
import { StreetResolvingSection } from './streets/StreetResolvingSection.tsx';
import { parseCalculatedTracksHook } from './map/hooks/parseCalculatedTracksHook.ts';
import { PlainMap } from './map/PlainMap.tsx';
import { MapToolbar } from './map/MapToolbar.tsx';
import { Sections } from './types.ts';
import { ImportExport } from './io/ImportExport.tsx';

interface Props {
    selectedSection: Sections;
}

export function MergeAndMap({ selectedSection }: Props) {
    parseCalculatedTracksHook();

    if (selectedSection === 'gps') {
        return (
            <Container fluid className={'m-0'}>
                <Row className="flex-xl-nowrap" style={{ height: '80vh', width: '100%' }}>
                    <Col xl={2}>
                        <FileUploadSection />
                    </Col>
                    <Col xl={4}>
                        <TrackCompositionSection />
                    </Col>
                    <Col xl={6}>
                        <div style={{ height: '90%' }}>
                            <PlainMap />
                        </div>
                        <div style={{ height: '5%' }}>
                            <MapToolbar />
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }

    if (selectedSection === 'streets') {
        return (
            <Container fluid className={'m-0'}>
                <StreetResolvingSection />
            </Container>
        );
    }

    if (selectedSection === 'importExport') {
        return (
            <Container fluid className={'m-0'}>
                <ImportExport />
            </Container>
        );
    }
}
