import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { AppDispatch } from '../store/store.ts';
import { debounceConstructionOfTracks } from '../logic/automaticCalculation.ts';

export const TrackPeople = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { id, peopleCount } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.trackPeople' })}
            value={peopleCount?.toString() ?? ''}
            onChange={(value) => {
                dispatch(trackMergeActions.setTrackPeopleCount({ id, peopleCount: getCount(value) }));
                debounceConstructionOfTracks(dispatch);
            }}
        />
    );
};
