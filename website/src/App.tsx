import './App.css';
import { TrackMergeSection } from './components/TrackMergeSection.tsx';
import { FileUploadSection } from './components/FileUploadSection.tsx';
import { Col, Container, Row } from 'react-bootstrap';
import { useState } from 'react';
import { TrackMapPage } from './TrackMapPage.tsx';

export function App() {
    const [showMap, setShowMap] = useState(false);
    return (
        <Container fluid className={'m-0'}>
            <h1 title={'Jump to the code'}>
                <a href={'https://github.com/SebastianHanfland/RallyGPXMerger'} target={'_blank'}>
                    Rally GPX Merger
                </a>
            </h1>
            {showMap ? (
                <TrackMapPage setHideMap={() => setShowMap(false)} />
            ) : (
                <Row className="flex-xl-nowrap" style={{ height: '85vh', overflow: 'auto', width: '100%' }}>
                    <Col xl={4}>
                        <FileUploadSection />
                    </Col>
                    <Col xl={8}>
                        <TrackMergeSection setShowMap={() => setShowMap(true)} />
                    </Col>
                </Row>
            )}
        </Container>
    );
}
