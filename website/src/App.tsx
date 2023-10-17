import './App.css';
import { TrackDownloadSection } from './components/TrackDownloadSection.tsx';
import { TrackMergeSection } from './components/TrackMergeSection.tsx';
import { FileUploadSection } from './components/FileUploadSection.tsx';
import { Col, Container, Row } from 'react-bootstrap';

export function App() {
    return (
        <Container fluid className={'m-0'}>
            <h1>Rally GPX Merger</h1>
            <Row className="flex-xl-nowrap" style={{ height: '75vh', overflow: 'auto', width: '100%' }}>
                <Col className={'md-3'} style={{ width: '30%' }}>
                    <FileUploadSection />
                </Col>
                <Col className={'md-3'} style={{ width: '30%' }}>
                    <TrackMergeSection />
                </Col>
                <Col className={'md-3'} style={{ width: '30%' }}>
                    <TrackDownloadSection />
                </Col>
            </Row>
        </Container>
    );
}
