import { Form } from 'react-bootstrap';
import { TrackComposition } from '../../store/types.ts';
import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../../store/trackMerge.reducer.ts';
import { TrackSelectionCell } from './TrackSelectionCell.tsx';
import { TrackButtonsCell } from './TrackButtonsCell.tsx';

interface Props {
    track: TrackComposition;
}

export function MergeTableTrack({ track }: Props) {
    const { name, id } = track;
    const dispatch = useDispatch();

    return (
        <tr>
            <td>
                <Form.Control
                    type="text"
                    placeholder="Track name"
                    value={name}
                    onChange={(value) =>
                        dispatch(trackMergeActions.setTrackName({ id, trackName: value.target.value }))
                    }
                />
            </td>
            <TrackSelectionCell track={track} />
            <TrackButtonsCell track={track} />
        </tr>
    );
}
