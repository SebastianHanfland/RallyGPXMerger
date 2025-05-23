import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { debounceConstructionOfTracks } from '../logic/automaticCalculation.ts';

export const TrackPrio = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { id, priority } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.priority' })}
            value={priority?.toString() ?? ''}
            onChange={(value) => {
                dispatch(trackMergeActions.setTrackPriority({ id, priority: getCount(value) }));
                debounceConstructionOfTracks(dispatch);
            }}
        />
    );
};
