import { ButtonGroup, DropdownButton, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FileDownloaderDropdownItem } from './FileDownloader.tsx';
import { FileChangeButton } from './FileChangeButton.tsx';
import { RemoveFileButton } from './RemoveFileButton.tsx';
import { getUsagesOfSegment } from './segmentUsageCounter.ts';
import { useIntl } from 'react-intl';
import { mapActions } from '../store/map.reducer.ts';
import { FlipGpxButton } from './FlipGpxButton.tsx';
import flip from '../../assets/flip.svg';
import check from '../../assets/check-circle.svg';
import { ResetResolvedStreetsButton } from './ResetResolvedStreetsButton.tsx';
import { SegmentSpeedCells } from '../settings/SegmentSpeedCells.tsx';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { useOnTheFlyCreatedGpx } from '../../utils/gpxUtil.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { ParsedGpxSegment } from '../store/types.ts';

interface Props {
    gpxSegment: ParsedGpxSegment;
    hideChangeButton?: boolean;
}

export function GpxSegmentRow({ gpxSegment, hideChangeButton }: Props) {
    const { id, filename, flipped, streetsResolved } = gpxSegment;
    const content = useOnTheFlyCreatedGpx(gpxSegment);
    const intl = useIntl();
    const dispatch = useDispatch();
    const trackCompositions = useSelector(getTrackCompositions);
    const { alert, tooltip } = getUsagesOfSegment(trackCompositions, id, intl);

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
                        dispatch(segmentDataActions.setFilename({ id, filename: value.target.value }));
                        dispatch(segmentDataActions.setFilterTerm(undefined));
                    }}
                />
            </td>
            <SegmentSpeedCells gpxSegment={gpxSegment} />
            <td style={alert ? { backgroundColor: 'red' } : undefined}>
                {flipped && <img src={flip} className="m-1" alt="flip" />}
                {streetsResolved && (
                    <img
                        src={check}
                        className="m-1"
                        alt="check"
                        title={intl.formatMessage({ id: 'msg.streetsResolved' })}
                    />
                )}
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
                    <ResetResolvedStreetsButton id={id} name={filename} />
                </DropdownButton>
            </td>
        </tr>
    );
}
