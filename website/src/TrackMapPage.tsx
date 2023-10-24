import { Col, Row } from 'react-bootstrap';
import { PlainMap } from './components/PlainMap.tsx';

export function TrackMapPage() {
    return (
        <Row className="flex-xl-nowrap" style={{ height: '85vh', overflow: 'auto', width: '100%' }}>
            <Col xl={12}>
                <PlainMap />
            </Col>
        </Row>
    );
}
