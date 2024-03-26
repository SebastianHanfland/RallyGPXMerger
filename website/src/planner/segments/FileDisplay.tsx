import { ButtonGroup, DropdownButton, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { gpxSegmentsActions } from '../store/gpxSegments.reducer.ts';
import { FileDownloaderDropdownItem } from './FileDownloader.tsx';
import { FileChangeButton } from './FileChangeButton.tsx';
import { RemoveFileButton } from './RemoveFileButton.tsx';
import { countUsagesOfSegment } from './segmentUsageCounter.ts';
import { GpxSegment } from '../../common/types.ts';
import { useIntl } from 'react-intl';
import { mapActions } from '../store/map.reducer.ts';
import { FlipGpxButton } from './FlipGpxButton.tsx';
import flip from '../../assets/flip.svg';

export function FileDisplay({ gpxSegment, hideChangeButton }: { gpxSegment: GpxSegment; hideChangeButton?: boolean }) {
    const { id, filename, content, flipped } = gpxSegment;
    const intl = useIntl();
    const dispatch = useDispatch();
    const { alert, tooltip } = useSelector(countUsagesOfSegment(id, intl));

    return (
        <tr
            title={tooltip}
            onMouseEnter={() => dispatch(mapActions.setHighlightedSegmentId(id))}
            onMouseLeave={() => dispatch(mapActions.setHighlightedSegmentId(undefined))}
        >
            <td style={alert ? { backgroundColor: 'red' } : undefined}>
                <Form.Control
                    type="text"
                    placeholder={intl.formatMessage({ id: 'msg.filename' })}
                    value={filename}
                    onChange={(value) => {
                        dispatch(gpxSegmentsActions.setFilename({ id, filename: value.target.value }));
                        dispatch(gpxSegmentsActions.setFilterTerm(undefined));
                    }}
                />
            </td>
            <td style={alert ? { backgroundColor: 'red' } : undefined}>
                {flipped && <img src={flip} className="m-1" alt="flip" />}
                <DropdownButton
                    as={ButtonGroup}
                    key={'primary'}
                    id={`dropdown-variants-${'primary'}`}
                    variant={'primary'.toLowerCase()}
                    title={''}
                >
                    <FileDownloaderDropdownItem content={content} name={`${filename}.gpx`} />

                    {!hideChangeButton && <FileChangeButton id={id} name={filename} />}
                    <RemoveFileButton id={id} name={filename} />
                    <FlipGpxButton id={id} name={filename} flipped={flipped} />
                </DropdownButton>
            </td>
        </tr>
    );
}
