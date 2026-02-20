import { Col, Form, Row } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { TrackComposition } from '../../store/types.ts';
import { TrackName } from '../TrackName.tsx';
import { TrackPeople } from '../TrackPeople.tsx';

export const PlannerSidebarTrackFormDetails = ({ track }: { track: TrackComposition }) => {
    return (
        <div>
            <Form.Group>
                <Row>
                    <Col>
                        <Form.Label>
                            <FormattedMessage id={'msg.trackName'} />
                        </Form.Label>
                        <TrackName track={track} key={track.id} />
                    </Col>
                    <Col>
                        <Form.Label>
                            <FormattedMessage id={'msg.trackPeople'} />
                        </Form.Label>
                        <TrackPeople track={track} key={track.id} />
                    </Col>
                </Row>
            </Form.Group>
        </div>
    );
};
