import { Col, Row } from 'react-bootstrap';
import { PlainMap } from './PlainMap.tsx';
import { MapToolbar } from './MapToolbar.tsx';

export function TrackMapPage() {
    return (
        <Row className="flex-xl-nowrap" style={{ height: '85vh', overflow: 'auto', width: '100%' }}>
            <Col xl={10}>
                <PlainMap />
            </Col>
            <Col xl={2}>
                <MapToolbar />
            </Col>
        </Row>
    );
}
