import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { getCount } from '../../utils/inputUtil.ts';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { AppDispatch } from '../store/planningStore.ts';
import { debounceConstructionOfTracks } from '../logic/automaticCalculation.ts';

export const TrackBuffer = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { id, buffer } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.buffer' })}
            value={buffer?.toString() ?? ''}
            onChange={(value) => {
                dispatch(trackMergeActions.setTrackBuffer({ id, buffer: getCount(value) }));
                debounceConstructionOfTracks(dispatch);
            }}
        />
    );
};
