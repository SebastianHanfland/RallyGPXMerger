import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { AppDispatch } from '../store/planningStore.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfRounding(dispatch: AppDispatch, value: number | undefined, id: string) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(trackMergeActions.setTrackRounding({ id, rounding: value }));
    }, 500);
}

export const TrackRounding = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { id, rounding } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.rounding' })}
            defaultValue={rounding?.toString() ?? ''}
            onChange={(value) => {
                debounceSettingOfRounding(dispatch, getCount(value), id);
            }}
        />
    );
};
