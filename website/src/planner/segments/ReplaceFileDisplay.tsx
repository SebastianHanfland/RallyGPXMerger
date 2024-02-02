import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getReplaceProcess, gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { GpxSegment } from '../../common/types.ts';
import { RemoveReplaceFileButton } from './RemoveReplaceFileButton.tsx';

export function ReplaceFileDisplay({ gpxSegment }: { gpxSegment: GpxSegment }) {
    const { id, filename } = gpxSegment;
    const dispatch = useDispatch();
    const replacementProcess = useSelector(getReplaceProcess);

    return (
        <tr>
            <td>
                <Form.Control
                    type="text"
                    placeholder="File name"
                    value={filename}
                    onChange={(value) => {
                        if (!replacementProcess) {
                            return;
                        }
                        dispatch(
                            gpxSegmentsActions.setReplaceProcess({
                                ...replacementProcess,
                                replacementSegments: replacementProcess.replacementSegments.map((segment) =>
                                    segment.id === id ? { ...segment, filename: value.target.value } : segment
                                ),
                            })
                        );
                    }}
                />
            </td>
            <td>
                <RemoveReplaceFileButton id={id} name={filename} />
            </td>
        </tr>
    );
}
