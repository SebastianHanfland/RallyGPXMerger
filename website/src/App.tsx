import './App.css';
import { TrackMergeSection } from './components/TrackMergeSection.tsx';
import { FileUploadSection } from './components/FileUploadSection.tsx';
import { Col, Container, Row } from 'react-bootstrap';
import { TrackMapPage } from './TrackMapPage.tsx';

export function App() {
    return (
        <Container fluid className={'m-0'}>
            <h1 title={'Jump to the code'}>
                <a href={'https://github.com/SebastianHanfland/RallyGPXMerger'} target={'_blank'}>
                    Rally GPX Merger
                </a>
            </h1>
            <Row className="flex-xl-nowrap" style={{ height: '60vh', width: '100%' }}>
                <Col xl={4}>
                    <FileUploadSection />
                </Col>
                <Col xl={8}>
                    <TrackMergeSection />
                </Col>
            </Row>
            <TrackMapPage />
        </Container>
    );
}
