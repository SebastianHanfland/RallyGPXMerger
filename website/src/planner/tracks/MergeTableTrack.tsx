import { Form } from 'react-bootstrap';
import { TrackComposition } from '../store/types.ts';
import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { TrackSelectionCell } from './TrackSelectionCell.tsx';
import { TrackButtonsCell } from './TrackButtonsCell.tsx';
import { getCount } from '../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';

interface Props {
    track: TrackComposition;
}

export function MergeTableTrack({ track }: Props) {
    const intl = useIntl();
    const { name, id, peopleCount, priority } = track;
    const dispatch = useDispatch();

    return (
        <tr>
            <td>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.trackName' })}
                    value={name}
                    onChange={(value) =>
                        dispatch(trackMergeActions.setTrackName({ id, trackName: value.target.value }))
                    }
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
                    value={peopleCount?.toString() ?? ''}
                    onChange={(value) =>
                        dispatch(trackMergeActions.setTrackPeopleCount({ id, peopleCount: getCount(value) }))
                    }
                />
            </td>
            <td>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.priority' })}
                    value={priority?.toString() ?? ''}
                    onChange={(value) =>
                        dispatch(trackMergeActions.setTrackPriority({ id, priority: getCount(value) }))
                    }
                />
            </td>
            <TrackSelectionCell track={track} />
            <TrackButtonsCell track={track} />
        </tr>
    );
}
