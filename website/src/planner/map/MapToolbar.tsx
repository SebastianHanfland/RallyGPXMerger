import { TimeSlider } from './TimeSlider.tsx';
import { MapContentSelection } from './MapContentSelection.tsx';
import { Col, Row } from 'react-bootstrap';

export function MapToolbar() {
    return (
        <Row className={'mx-1 mt-1 shadow'} style={{ height: '10vh' }}>
            <Col xl={6}>
                <TimeSlider />
            </Col>
            <Col xl={6}>
                <MapContentSelection />
            </Col>
        </Row>
    );
}
