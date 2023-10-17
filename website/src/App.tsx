import './App.css';
import { TrackMergeSection } from './components/TrackMergeSection.tsx';
import { FileUploadSection } from './components/FileUploadSection.tsx';
import { Col, Container, Row } from 'react-bootstrap';

export function App() {
    return (
        <Container fluid className={'m-0'}>
            <h1>Rally GPX Merger</h1>
            <Row className="flex-xl-nowrap" style={{ height: '85vh', overflow: 'auto', width: '100%' }}>
                <Col xl={4}>
                    <FileUploadSection />
                </Col>
                <Col xl={8}>
                    <TrackMergeSection />
                </Col>
            </Row>
        </Container>
    );
}
