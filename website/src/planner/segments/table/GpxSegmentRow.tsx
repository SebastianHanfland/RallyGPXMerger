import { ButtonGroup, DropdownButton, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { SegmentDownloadDropdownItem } from './SegmentDownloadDropdownItem';
import { FileChangeWithUploadButton } from '../actions/FileChangeWithUploadButton';
import { RemoveFileButton } from '../actions/RemoveFileButton';
import { getUsagesOfSegment, SegmentUsages } from './segmentUsageCounter';
import { useIntl } from 'react-intl';
import { mapActions } from '../../store/map.reducer';
import { FlipGpxButton } from '../actions/FlipGpxButton';
import flip from '../../../assets/flip.svg';
import { ResetResolvedStreetsButton } from '../actions/ResetResolvedStreetsButton';
import { SegmentSpeedCells } from './SegmentSpeedCells';
import { segmentDataActions } from '../../store/segmentData.redux';
import { EditSegmentColorButton } from '../actions/EditSegmentColor';
import { FileChangeButton } from '../actions/FileChangeButton';
import { formatNumber } from '../../../utils/numberUtil';
import { memo } from 'react';

interface Props {
    id: string;
    filename: string;
    flipped?: boolean;
    color?: string;
    hideChangeButton?: boolean;
    distance?: number;
    segmentUsages: SegmentUsages;
    planningHasTracks: boolean;
    calculatedSpeed: number | undefined;
    info: string | undefined;
}

function GpxSegmentRow({
    id,
    filename,
    flipped,
    color,
    hideChangeButton,
    distance,
    segmentUsages,
    planningHasTracks,
    calculatedSpeed,
    info,
}: Props) {
    const intl = useIntl();
    const dispatch = useDispatch();
    const { alert, tooltip } = getUsagesOfSegment(segmentUsages, id, intl, planningHasTracks);
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
            <SegmentSpeedCells id={id} calculatedSpeed={calculatedSpeed} />
            <td style={alert ? { backgroundColor: 'red' } : undefined}>
                {flipped && <img src={flip} className="m-1" alt="flip" />}
                <DropdownButton
                    as={ButtonGroup}
                    key={'primary'}
                    id={`dropdown-variants-${'primary'}`}
                    variant={'primary'.toLowerCase()}
                    title={''}
                >
                    <SegmentDownloadDropdownItem id={id} name={`${filename}.gpx`} />

                    {!hideChangeButton && <FileChangeWithUploadButton id={id} name={filename} />}
                    {!hideChangeButton && <FileChangeButton id={id} name={filename} />}
                    <RemoveFileButton id={id} name={filename} />
                    <FlipGpxButton id={id} name={filename} flipped={flipped} />
                    <EditSegmentColorButton id={id} name={filename} color={color} />
                    <ResetResolvedStreetsButton id={id} name={filename} />
                </DropdownButton>
            </td>
        </tr>
    );
}

export const MemoizedGpxSegmentRow = memo(GpxSegmentRow);
