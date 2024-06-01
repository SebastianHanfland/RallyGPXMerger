import { TrackSelectionCell } from '../tracks/TrackSelectionCell.tsx';
import { TrackButtonsCell } from '../tracks/TrackButtonsCell.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { getFilteredTrackCompositions, trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { FormattedMessage, useIntl } from 'react-intl';

export const PlannerSidebarTrackDetails = () => {
    const trackCompositions = useSelector(getFilteredTrackCompositions);
    const intl = useIntl();
    const dispatch = useDispatch();

    const track = trackCompositions[0];
    const { name, id, peopleCount, priority } = track;
    return (
        <div className={'m-2'}>
            <div>
                <Form.Group>
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
                </Form.Group>
            </div>
            <div>
                <Form.Group>
                    <Form.Label>
                        <FormattedMessage id={'msg.trackPeople'} />
                    </Form.Label>
                    <Form.Control
                        type="text"
                        placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
                        value={peopleCount?.toString() ?? ''}
                        onChange={(value) =>
                            dispatch(trackMergeActions.setTrackPeopleCount({ id, peopleCount: getCount(value) }))
                        }
                    />
                </Form.Group>
            </div>
            <div>
                <Form.Group>
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
                </Form.Group>
            </div>

            <div style={{ width: '100%' }} className={'my-2'}>
                <TrackSelectionCell track={track} />
            </div>
            <div>
                <TrackButtonsCell track={track} />
            </div>
        </div>
    );
};
