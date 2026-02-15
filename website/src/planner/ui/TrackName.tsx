import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { triggerAutomaticCalculation } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/planningStore.ts';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfName(dispatch: AppDispatch, value: string, id: string) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(trackMergeActions.setTrackName({ id, trackName: value }));
        dispatch(triggerAutomaticCalculation);
    }, 500);
}

export const TrackName = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { name, id } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.trackName' })}
            onChange={(value) => {
                debounceSettingOfName(dispatch, value.target.value, id);
            }}
            defaultValue={name}
        />
    );
};
