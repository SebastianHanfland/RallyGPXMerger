import { TrackButtonsCell } from '../tracks/TrackButtonsCell.tsx';
import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Col, Form, Row } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { TrackSegmentSelection } from '../tracks/TrackSegmentSelection.tsx';

export const PlannerSidebarTrackDetails = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch = useDispatch();

    const { name, id, peopleCount, priority } = track;
    return (
        <div className={'m-2'}>
            <h4>
                <span className={'mx-2'}>{name}</span>
                <TrackButtonsCell track={track} />
            </h4>
            <div>
                <Form.Group>
                    <Row>
                        <Col>
                            <Form.Label>
                                <FormattedMessage id={'msg.trackName'} />
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={intl.formatMessage({ id: 'msg.trackName' })}
                                value={name}
                                onChange={(value) =>
                                    dispatch(trackMergeActions.setTrackName({ id, trackName: value.target.value }))
                                }
                            />
                        </Col>
                        <Col>
                            <Form.Label>
                                <FormattedMessage id={'msg.trackPeople'} />
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
                                value={peopleCount?.toString() ?? ''}
                                onChange={(value) =>
                                    dispatch(
                                        trackMergeActions.setTrackPeopleCount({ id, peopleCount: getCount(value) })
                                    )
                                }
                            />
                        </Col>
                        <Col>
                            <Form.Label>
                                <FormattedMessage id={'msg.priority'} />
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder={intl.formatMessage({ id: 'msg.priority' })}
                                value={priority?.toString() ?? ''}
                                onChange={(value) =>
                                    dispatch(trackMergeActions.setTrackPriority({ id, priority: getCount(value) }))
                                }
                            />
                        </Col>
                    </Row>
                </Form.Group>
            </div>
            <div></div>

            <div style={{ width: '100%' }} className={'my-2'}>
                <h4>
                    <FormattedMessage id={'msg.segments'} />
                </h4>
                <TrackSegmentSelection track={track} />
            </div>
            <div></div>
        </div>
    );
};
