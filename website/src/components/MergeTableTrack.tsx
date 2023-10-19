import { Button, Form } from 'react-bootstrap';
import { GpxSegment, TrackComposition } from '../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import Select from 'react-select';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { BREAK_IDENTIFIER } from '../logic/primitive/primitiveSolver.ts';

interface Props {
    track: TrackComposition;
}

function toOption(gpxSegment: GpxSegment): { value: string; label: string } {
    return {
        value: gpxSegment.id,
        label: gpxSegment.filename.replace('.gpx', ''),
    };
}

function isDefined<T>(arg: T | undefined): arg is T {
    return arg !== undefined;
}

const breaks = [
    { value: `05${BREAK_IDENTIFIER}1`, label: '+ 05 min' },
    { value: `05${BREAK_IDENTIFIER}2`, label: '+ 05 min' },
    { value: `10${BREAK_IDENTIFIER}1`, label: '+ 10 min' },
    { value: `10${BREAK_IDENTIFIER}2`, label: '+ 10 min' },
    { value: `15${BREAK_IDENTIFIER}1`, label: '+ 15 min' },
    { value: `15${BREAK_IDENTIFIER}2`, label: '+ 15 min' },
    { value: `20${BREAK_IDENTIFIER}1`, label: '+ 20 min' },
    { value: `20${BREAK_IDENTIFIER}2`, label: '+ 20 min' },
    { value: `25${BREAK_IDENTIFIER}1`, label: '+ 25 min' },
    { value: `25${BREAK_IDENTIFIER}2`, label: '+ 25 min' },
    { value: `30${BREAK_IDENTIFIER}1`, label: '+ 30 min' },
    { value: `30${BREAK_IDENTIFIER}2`, label: '+ 30 min' },
];

export function MergeTableTrack({ track }: Props) {
    const { name, id, segmentIds } = track;
    const dispatch = useDispatch();
    const gpxSegments = useSelector(getGpxSegments);
    const options = [...gpxSegments.map(toOption), ...breaks];

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
            <td>
                <Select
                    isMulti
                    value={segmentIds
                        .map((segmentId) => options.find((option) => option.value === segmentId))
                        .filter(isDefined)}
                    name="colors"
                    options={options}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(newValue) => {
                        const selectedIds = newValue.map((entry) => entry.value);
                        dispatch(trackMergeActions.setSegments({ id, segments: selectedIds }));
                    }}
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
