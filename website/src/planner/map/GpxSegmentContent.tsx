import { useSelector } from 'react-redux';
import { FileDownloaderDropdownItem } from '../download/FileDownloader';
import { FileChangeWithUploadButton } from '../segments/actions/FileChangeWithUploadButton';
import { RemoveFileButton } from '../segments/actions/RemoveFileButton';
import { FlipGpxButton } from '../segments/actions/FlipGpxButton';
import { ResetResolvedStreetsButton } from '../segments/actions/ResetResolvedStreetsButton';
import { SplitSegmentDropdownItem } from '../segments/actions/SplitSegment';
import { getClickOnSegment, getParsedGpxSegments } from '../store/segmentData.redux';
import { getGpxContentStringFromParsedSegment } from '../../utils/SimpleGPXFromPoints';
import { EditSegmentColorButton } from '../segments/actions/EditSegmentColor';
import { FileChangeButton } from '../segments/actions/FileChangeButton';

export const GpxSegmentContent = () => {
    const clickOnSegment = useSelector(getClickOnSegment);
    const segments = useSelector(getParsedGpxSegments);
    const clickedSegment = segments.find((segment) => segment.id === clickOnSegment?.segmentId);
    if (!clickedSegment) {
        return null;
    }
    const { id, filename, flipped } = clickedSegment;

    return (
        <div>
            <FileDownloaderDropdownItem
                content={() => getGpxContentStringFromParsedSegment(clickedSegment)}
                name={`${filename}.gpx`}
            />
            <SplitSegmentDropdownItem />

            <FileChangeWithUploadButton id={id} name={filename} />
            <FileChangeButton id={id} name={filename} />
            <RemoveFileButton id={id} name={filename} />
            <FlipGpxButton id={id} name={filename} flipped={flipped} />
            <EditSegmentColorButton id={id} name={filename} color={clickedSegment.color} />
            <ResetResolvedStreetsButton id={id} name={filename} />
        </div>
    );
};
