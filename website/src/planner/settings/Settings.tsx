import { Col, Row } from 'react-bootstrap';
import { TrackMergeParameters } from '../parameters/TrackMergeParameters.tsx';
import { SegmentSpeedSettings } from './SegmentSpeedSettings.tsx';
import { ConstructionSites } from './ConstructionSites.tsx';
import { FormattedMessage } from 'react-intl';

export function Settings() {
    return (
        <div>
            <Row className="flex-xl-nowrap" style={{ height: '80vh', width: '100%' }}>
                <Col xl={4}>
                    <div className={'p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
                        <h4>
                            <FormattedMessage id={'msg.rallyParameters.title'} />
                        </h4>
                        <TrackMergeParameters />
                    </div>
                </Col>
                <Col xl={4}>
                    <SegmentSpeedSettings />
                </Col>
                <Col xl={4}>
                    <ConstructionSites />
                </Col>
            </Row>
        </div>
    );
}
