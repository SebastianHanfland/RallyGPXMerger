import { Button, Form } from 'react-bootstrap';
import { GpxSegment, TrackComposition } from '../store/types.ts';
import { useDispatch, useSelector } from 'react-redux';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import Select from 'react-select';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';

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

export function MergeTableTrack({ track }: Props) {
    const { name, id, segments } = track;
    const dispatch = useDispatch();
    const gpxSegments = useSelector(getGpxSegments);
    const options = gpxSegments.map(toOption);

    return (
        <tr>
            <td>
                <Form.Control type="text" placeholder="Track name" value={name} />
            </td>
            <td>
                <Select
                    isMulti
                    value={segments
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
