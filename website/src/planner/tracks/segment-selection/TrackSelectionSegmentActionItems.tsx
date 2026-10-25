import { Dropdown } from 'react-bootstrap';
import { FormattedMessage } from 'react-intl';
import { FileDownloaderDropdownItem } from '../../download/FileDownloader';
import { FileChangeWithUploadButton } from '../../segments/FileChangeWithUploadButton';
import { FileChangeButton } from '../../segments/FileChangeButton';
import { RemoveFileButton } from '../../segments/RemoveFileButton';
import { FlipGpxButton } from '../../segments/FlipGpxButton';
import { ResetResolvedStreetsButton } from '../../segments/ResetResolvedStreetsButton';
import { EditSegmentColorButton } from '../../segments/EditSegmentColor';
import { ParsedGpxSegment } from '../../store/types';
import { getGpxContentStringFromParsedSegment } from '../../../utils/SimpleGPXFromPoints';

interface Props {
    segment: ParsedGpxSegment;
    segmentIndex: number;
    includeInsertionActions?: boolean;
    onAction?: () => void;
    onAddBreak?: (insertionIndex: number) => void;
    onAddEntryPoint?: (insertionIndex: number) => void;
}

export function TrackSelectionSegmentActionItems({
    segment,
    segmentIndex,
    includeInsertionActions,
    onAction,
    onAddBreak,
    onAddEntryPoint,
}: Props) {
    return (
        <>
            <FileDownloaderDropdownItem
                content={() => getGpxContentStringFromParsedSegment(segment)}
                name={`${segment.filename}.gpx`}
                onClick={onAction}
            />
            <FileChangeWithUploadButton id={segment.id} name={segment.filename} onAction={onAction} />
            <FileChangeButton id={segment.id} name={segment.filename} onAction={onAction} />
            <RemoveFileButton id={segment.id} name={segment.filename} onAction={onAction} />
            <FlipGpxButton id={segment.id} name={segment.filename} flipped={segment.flipped} onAction={onAction} />
            <EditSegmentColorButton id={segment.id} name={segment.filename} color={segment.color} onAction={onAction} />
            <ResetResolvedStreetsButton id={segment.id} name={segment.filename} onAction={onAction} />
            {includeInsertionActions && (
                <>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => onAddBreak?.(segmentIndex)}>
                        <FormattedMessage id={'msg.addBreakBefore'} />
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onAddBreak?.(segmentIndex + 1)}>
                        <FormattedMessage id={'msg.addBreakAfter'} />
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onAddEntryPoint?.(segmentIndex)}>
                        <FormattedMessage id={'msg.addEntryPointBefore'} />
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onAddEntryPoint?.(segmentIndex + 1)}>
                        <FormattedMessage id={'msg.addEntryPointAfter'} />
                    </Dropdown.Item>
                </>
            )}
        </>
    );
}
