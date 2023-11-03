import { Col, Row } from 'react-bootstrap';
import { TrackDataOverview } from './TrackDataOverview.tsx';
import { ApiKeyInput } from './ApiKeyInput.tsx';

export const StreetResolvingSection = () => {
    return (
        <Row className="flex-xl-nowrap" style={{ height: '60vh', width: '100%' }}>
            <Col xl={4}>
                <TrackDataOverview />
            </Col>
            <Col xl={4}>
                <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
                    <h4>Information of Address resolving service</h4>
                    <ApiKeyInput />
                </div>
            </Col>
            <Col xl={4}>
                <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
                    <h4>Download different data sets</h4>
                    <ul>
                        <li>When are which streets blocked</li>
                        <li>Detailed information of each track</li>
                    </ul>
                </div>
            </Col>
        </Row>
    );
};
