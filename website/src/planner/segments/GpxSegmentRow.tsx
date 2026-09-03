import { ButtonGroup, DropdownButton, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FileDownloaderDropdownItem } from '../download/FileDownloader.tsx';
import { FileChangeWithUploadButton } from './FileChangeWithUploadButton.tsx';
import { RemoveFileButton } from './RemoveFileButton.tsx';
import { getUsagesOfSegment, SegmentUsages } from './segmentUsageCounter.ts';
import { useIntl } from 'react-intl';
import { mapActions } from '../store/map.reducer.ts';
import { FlipGpxButton } from './FlipGpxButton.tsx';
import flip from '../../assets/flip.svg';
import { ResetResolvedStreetsButton } from './ResetResolvedStreetsButton.tsx';
import { SegmentSpeedCells } from './SegmentSpeedCells.tsx';
import { useOnTheFlyCreatedGpx } from '../../utils/gpxUtil.ts';
import { segmentDataActions } from '../store/segmentData.redux.ts';
import { ParsedGpxSegment } from '../store/types.ts';
import { EditSegmentColorButton } from './EditSegmentColor.tsx';
import { FileChangeButton } from './FileChangeButton.tsx';
import { getAggregateStreetsInSegments } from '../../common/calculation/aggregated-segments/aggregatePointsSelector.ts';
import { getSegmentInfo } from '../tracks/segment-selection/getSegmentInfo.ts';
import { formatNumber } from '../../utils/numberUtil.ts';

interface Props {
    gpxSegment: ParsedGpxSegment;
    hideChangeButton?: boolean;
    distance?: number;
    segmentUsages: SegmentUsages;
    planningHasTracks: boolean;
}

export function GpxSegmentRow({ gpxSegment, hideChangeButton, distance, segmentUsages, planningHasTracks }: Props) {
    const { id, filename, flipped } = gpxSegment;
    const content = useOnTheFlyCreatedGpx(gpxSegment);
    const intl = useIntl();
    const dispatch = useDispatch();
    const { alert, tooltip } = getUsagesOfSegment(segmentUsages, id, intl, planningHasTracks);
    const aggregatedSegments = useSelector(getAggregateStreetsInSegments);
    const aggregatedInfo = aggregatedSegments[id];
    const info = getSegmentInfo(aggregatedInfo);

    return (
        <tr
            title={info ? info + '\n\n' + tooltip : tooltip}
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
            <td>{distance === undefined ? null : `${formatNumber(distance)} km`}</td>
            <SegmentSpeedCells gpxSegment={gpxSegment} />
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

                    {!hideChangeButton && <FileChangeWithUploadButton id={id} name={filename} />}
                    {!hideChangeButton && <FileChangeButton id={id} name={filename} />}
                    <RemoveFileButton id={id} name={filename} />
                    <FlipGpxButton id={id} name={filename} flipped={flipped} />
                    <EditSegmentColorButton segment={gpxSegment} />
                    <ResetResolvedStreetsButton id={id} name={filename} />
                </DropdownButton>
            </td>
        </tr>
    );
}
