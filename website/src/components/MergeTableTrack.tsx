import { Button, Form } from 'react-bootstrap';
import { TrackComposition } from '../store/types.ts';
import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';

interface Props {
    track: TrackComposition;
}

export function MergeTableTrack({ track }: Props) {
    const { name, id } = track;
    const dispatch = useDispatch();

    return (
        <tr>
            <td>
                <Form.Control type="text" placeholder="Track name" value={name} />
            </td>
            <td>
                <Form.Control type="text" placeholder="Track name" value={'A_11 + A_12 + 30min'} />
            </td>
            <td>
                <Button variant="danger" onClick={() => dispatch(trackMergeActions.removeTrackComposition(id))}>
                    x
                </Button>
            </td>
        </tr>
    );
}
