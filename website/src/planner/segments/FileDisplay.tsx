import { ButtonGroup, DropdownButton, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { FileDownloaderDropdownItem } from './FileDownloader.tsx';
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
                <DropdownButton
                    as={ButtonGroup}
                    key={'primary'}
                    id={`dropdown-variants-${'primary'}`}
                    variant={'primary'.toLowerCase()}
                    title={''}
                >
                    <FileDownloaderDropdownItem content={content} name={filename} />
                    {!hideChangeButton && <FileChangeButton id={id} name={filename} />}
                    <RemoveFileButton id={id} name={filename} />
                </DropdownButton>
            </td>
        </tr>
    );
}
