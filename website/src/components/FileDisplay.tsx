import { Button, Form } from 'react-bootstrap';
import { GpxSegment } from '../store/types.ts';
import { useDispatch } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { trackMergeActions } from '../store/trackMerge.reducer.ts';
import { FileDownloader } from './FileDownloader.tsx';
import { ALLOWS_TO_ENTER_PEOPLE_AT_START } from './FileDragAndDrop.tsx';
import { FileChangeButton } from './FileChangeButton.tsx';

function getCount(value: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const number = Number(value.target.value);
    return isNaN(number) ? 0 : number;
}

export function FileDisplay({ gpxSegment }: { gpxSegment: GpxSegment }) {
    const { id, filename, content, peopleCountStart, peopleCountEnd } = gpxSegment;
    const dispatch = useDispatch();

    return (
        <tr>
            <td>
                <div>
                    <FileDownloader content={content} name={filename} />
                    <FileChangeButton id={id} name={filename} />
                </div>
            </td>
            {ALLOWS_TO_ENTER_PEOPLE_AT_START && (
                <td>
                    <Form.Control
                        type="text"
                        placeholder="People at start"
                        value={peopleCountStart}
                        onChange={(value) =>
                            dispatch(gpxSegmentsActions.setPeopleCountStart({ id, count: getCount(value) }))
                        }
                    />
                </td>
            )}
            <td>
                <Form.Control
                    type="text"
                    placeholder="People at end"
                    value={peopleCountEnd}
                    onChange={(value) => dispatch(gpxSegmentsActions.setPeopleCountEnd({ id, count: getCount(value) }))}
                />
            </td>
            <td>
                <Button
                    variant="danger"
                    title="Remove file and all references"
                    onClick={() => {
                        dispatch(gpxSegmentsActions.removeGpxSegment(id));
                        dispatch(trackMergeActions.removeGpxSegment(id));
                    }}
                >
                    x
                </Button>
            </td>
        </tr>
    );
}
