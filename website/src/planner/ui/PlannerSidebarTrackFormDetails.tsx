import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Col, Form, Row } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { FormattedMessage, useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/store.ts';

let constructTimeout: undefined | NodeJS.Timeout;

function debounceConstructionOfTracks(dispatch: AppDispatch) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(triggerAutomaticCalculation);
    }, 500);
}

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
                            onChange={(value) => {
                                dispatch(trackMergeActions.setTrackName({ id, trackName: value.target.value }));
                                debounceConstructionOfTracks(dispatch);
                            }}
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
                                debounceConstructionOfTracks(dispatch);
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
                                debounceConstructionOfTracks(dispatch);
                            }}
                        />
                    </Col>
                </Row>
            </Form.Group>
        </div>
    );
};
