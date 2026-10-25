import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer';
import { Form } from 'react-bootstrap';
import { getCount } from '../../../utils/inputUtil';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../../store/types';
import { AppDispatch } from '../../store/planningStore';

let constructTimeout: undefined | NodeJS.Timeout;

export function debounceSettingOfPeople(dispatch: AppDispatch, count: number | undefined, id: string) {
    clearTimeout(constructTimeout);
    constructTimeout = setTimeout(() => {
        dispatch(trackMergeActions.setTrackPeopleCount({ id, peopleCount: count }));
    }, 500);
}

export const TrackPeople = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { id, peopleCount } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
            defaultValue={peopleCount?.toString() ?? ''}
            onChange={(value) => {
                debounceSettingOfPeople(dispatch, getCount(value), id);
            }}
        />
    );
};
