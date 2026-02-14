import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RemoveReplaceFileButton } from './RemoveReplaceFileButton.tsx';
import { useIntl } from 'react-intl';
import { getReplaceProcess, segmentDataActions } from '../new-store/segmentData.redux.ts';
import { ParsedGpxSegment } from '../store/types.ts';

export function ReplaceFileDisplay({ gpxSegment }: { gpxSegment: ParsedGpxSegment }) {
    const intl = useIntl();
    const { id, filename } = gpxSegment;
    const dispatch = useDispatch();
    const replacementProcess = useSelector(getReplaceProcess);

    return (
        <tr>
            <td>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.filename' })}
                    value={filename}
                    onChange={(value) => {
                        if (!replacementProcess) {
                            return;
                        }
                        dispatch(
                            segmentDataActions.setReplaceProcess({
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
