import { Button, Form } from 'react-bootstrap';
import { TrackComposition } from '../store/types.ts';
import { useDispatch } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import Select from 'react-select';

interface Props {
    track: TrackComposition;
}

const colourOptions = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

export function MergeTableTrack({ track }: Props) {
    const { name, id } = track;
    const dispatch = useDispatch();

    return (
        <tr>
            <td>
                <Form.Control type="text" placeholder="Track name" value={name} />
            </td>
            <td>
                {/*<Form.Control type="text" placeholder="Track name" value={'A_11 + A_12 + 30min'} />*/}
                <Select
                    defaultValue={[colourOptions[2], colourOptions[3]]}
                    isMulti
                    name="colors"
                    options={colourOptions}
                    className="basic-multi-select"
                    classNamePrefix="select"
                />
            </td>
            <td>
                <Button variant="danger" onClick={() => dispatch(trackMergeActions.removeTrackComposition(id))}>
                    x
                </Button>
            </td>
        </tr>
    );
}
