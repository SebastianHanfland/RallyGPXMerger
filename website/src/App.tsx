import './App.css';
import { TrackDownloadSection } from './components/TrackDownloadSection.tsx';
import { TrackMergeSection } from './components/TrackMergeSection.tsx';
import { FileUploadSection } from './components/FileUploadSection.tsx';
import { Col, Container, Row } from 'react-bootstrap';

export function App() {
    return (
        <Container fluid className={'m-0'}>
            <h1>Rally GPX Merger</h1>
            <Row className="flex-xl-nowrap" style={{ height: '85vh', overflow: 'auto', width: '100%' }}>
                <Col className={'m-3 shadow'} xl={4}>
                    <FileUploadSection />
                </Col>
                <Col className={'m-3 shadow'} xl={6}>
                    <TrackMergeSection />
                </Col>
                <Col className={'m-3 shadow'} xl={1}>
                    <TrackDownloadSection />
                </Col>
            </Row>
        </Container>
    );
}
