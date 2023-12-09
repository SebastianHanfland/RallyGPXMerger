import { TimeSlider } from './TimeSlider.tsx';
import { SourceSelection } from './SourceSelection.tsx';
import { Col, Row } from 'react-bootstrap';

export function MapToolbar() {
    return (
        <Row className={'m-2 p-2 shadow'}>
            <Col xl={6}>
                <TimeSlider />
            </Col>
            <Col xl={6}>
                <SourceSelection />
            </Col>
        </Row>
    );
}
