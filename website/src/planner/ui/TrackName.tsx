import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { TrackComposition } from '../store/types.ts';
import { debounceConstructionOfTracks } from '../logic/automaticCalculation.ts';
import { AppDispatch } from '../store/store.ts';

export const TrackName = ({ track }: { track: TrackComposition }) => {
    const intl = useIntl();
    const dispatch: AppDispatch = useDispatch();

    const { name, id } = track;
    return (
        <Form.Control
            type="text"
            placeholder={intl.formatMessage({ id: 'msg.trackName' })}
            value={name}
            onChange={(value) => {
                dispatch(trackMergeActions.setTrackName({ id, trackName: value.target.value }));
                debounceConstructionOfTracks(dispatch);
            }}
        />
    );
};
