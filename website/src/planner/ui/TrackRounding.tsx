import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { debounceConstructionOfTracks } from '../logic/automaticCalculation.ts';

export const TrackRounding = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { id, rounding } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.rounding' })}
            value={rounding?.toString() ?? ''}
            onChange={(value) => {
                dispatch(trackMergeActions.setTrackRounding({ id, rounding: getCount(value) }));
                debounceConstructionOfTracks(dispatch);
            }}
        />
    );
};
