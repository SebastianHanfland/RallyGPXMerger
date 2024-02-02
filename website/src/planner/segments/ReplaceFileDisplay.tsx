import { Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { GpxSegment } from '../../common/types.ts';
import { RemoveReplaceFileButton } from './RemoveReplaceFileButton.tsx';

export function ReplaceFileDisplay({ gpxSegment }: { gpxSegment: GpxSegment }) {
    const { id, filename } = gpxSegment;
    const dispatch = useDispatch();

    return (
        <tr>
            <td>
                <Form.Control
                    type="text"
                    placeholder="File name"
                    value={filename}
                    onChange={(value) => dispatch(gpxSegmentsActions.setFilename({ id, filename: value.target.value }))}
                />
            </td>
            <td>
                <RemoveReplaceFileButton id={id} name={filename} />
            </td>
        </tr>
    );
}
