import { Accordion, Col, Row } from 'react-bootstrap';
import { TrackDataOverview } from './TrackDataOverview.tsx';
import { ApiKeyInput } from './ApiKeyInput.tsx';
import { StreetResolvedTracks } from './StreetResolvedTracks.tsx';
import { FormattedMessage } from 'react-intl';

export const StreetResolvingSection = () => {
    return (
        <Row className="flex-xl-nowrap" style={{ height: '80vh', width: '100%' }}>
            <Col xl={4}>
                <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
                    <TrackDataOverview />
                    <hr />
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <FormattedMessage id={'msg.ownApiKey'} />
                            </Accordion.Header>
                            <Accordion.Body>
                                <ApiKeyInput />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </Col>
            <Col xl={8}>
                <div className={'m-2 p-2 shadow'} style={{ height: '95%' }}>
                    <StreetResolvedTracks />
                </div>
            </Col>
        </Row>
    );
};
