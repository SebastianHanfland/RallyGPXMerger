import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { getCount } from '../../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../../store/types.ts';
import { AppDispatch } from '../../store/planningStore.ts';
import { useEffect, useState } from 'react';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfBuffer(dispatch: AppDispatch, value: number | undefined, id: string) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(trackMergeActions.setTrackBuffer({ id, buffer: value }));
    }, 500);
}

export const TrackBuffer = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { id, buffer } = track;
    const [value, setValue] = useState(buffer?.toString() ?? '');

    useEffect(() => {
        setValue(buffer?.toString() ?? '');
    }, [buffer]);

    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.buffer' })}
            value={value}
            onChange={(event) => {
                setValue(event.target.value);
                debounceSettingOfBuffer(dispatch, getCount(event), id);
            }}
        />
    );
};
