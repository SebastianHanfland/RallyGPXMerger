import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { AppDispatch } from '../store/planningStore.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfPrio(dispatch: AppDispatch, value: number | undefined, id: string) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(trackMergeActions.setTrackPriority({ id, priority: value }));
    }, 500);
}

export const TrackPrio = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { id, priority } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.priority' })}
            defaultValue={priority?.toString() ?? ''}
            onChange={(value) => {
                debounceSettingOfPrio(dispatch, getCount(value), id);
            }}
        />
    );
};
