import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Col, Form, Row } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { mergeAndGroupAndResolve } from '../logic/doTheMagic.ts';
import { AppDispatch } from '../store/store.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export const PlannerSidebarTrackFormDetails = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { name, id, peopleCount, priority } = track;
    return (
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
                            onChange={(value) => {
                                dispatch(trackMergeActions.setTrackPeopleCount({ id, peopleCount: getCount(value) }));
                                clearTimeout(constructTimeout);
                                constructTimeout = setTimeout(() => {
                                    dispatch(mergeAndGroupAndResolve);
                                }, 500);
                            }}
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
                            onChange={(value) => {
                                dispatch(trackMergeActions.setTrackPriority({ id, priority: getCount(value) }));
                                clearTimeout(constructTimeout);
                                constructTimeout = setTimeout(() => {
                                    dispatch(mergeAndGroupAndResolve);
                                }, 500);
                            }}
                        />
                    </Col>
                </Row>
            </Form.Group>
        </div>
    );
};
