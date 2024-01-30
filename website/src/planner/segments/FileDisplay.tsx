import { Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { FileDownloader } from './FileDownloader.tsx';
import { FileChangeButton } from './FileChangeButton.tsx';
import { RemoveFileButton } from './RemoveFileButton.tsx';
import { countUsagesOfSegment } from './segmentUsageCounter.ts';
import { GpxSegment } from '../../common/types.ts';

export function FileDisplay({ gpxSegment, hideChangeButton }: { gpxSegment: GpxSegment; hideChangeButton?: boolean }) {
    const { id, filename, content } = gpxSegment;
    const dispatch = useDispatch();
    const { counter, tracks } = useSelector(countUsagesOfSegment(id));

    const tooltip =
        counter === 0 ? 'This segment is not used' : `This segment is used in ${counter} tracks:\n${tracks.join('\n')}`;

    return (
        <tr title={tooltip}>
            <td style={counter === 0 ? { backgroundColor: 'red' } : undefined}>
                <Form.Control
                    type="text"
                    placeholder="File name"
                    value={filename}
                    onChange={(value) => dispatch(gpxSegmentsActions.setFilename({ id, filename: value.target.value }))}
                />
            </td>
            <td style={counter === 0 ? { backgroundColor: 'red' } : undefined}>
                <FileDownloader content={content} name={filename} id={id} onlyIcon={true} />
                {!hideChangeButton && <FileChangeButton id={id} name={filename} />}
                <RemoveFileButton id={id} name={filename} />
            </td>
        </tr>
    );
}
