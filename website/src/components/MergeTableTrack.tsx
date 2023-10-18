import { Form } from 'react-bootstrap';
import { TrackComposition } from '../store/types.ts';

interface Props {
    track: TrackComposition;
}

export function MergeTableTrack(props: Props) {
    return (
        <tr>
            <td>
                <Form.Control type="text" placeholder="Track name" value={props.track.name} />
            </td>
            <td>
                <Form.Control type="text" placeholder="Track name" value={'A_11 + A_12 + 30min'} />
            </td>
        </tr>
    );
}
