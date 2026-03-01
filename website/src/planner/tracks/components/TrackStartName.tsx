import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../../store/types.ts';
import { AppDispatch } from '../../store/planningStore.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfBuffer(dispatch: AppDispatch, value: string | undefined, id: string) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(trackMergeActions.setTrackStartName({ id, startName: value }));
    }, 500);
}

export const TrackStartName = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { id, startName } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.startName' })}
            defaultValue={startName?.toString() ?? ''}
            onChange={(value) => {
                debounceSettingOfBuffer(dispatch, value.target.value, id);
            }}
        />
    );
};
