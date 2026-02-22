import { useSelector } from 'react-redux';
import { FileDownloaderDropdownItem } from '../download/FileDownloader.tsx';
import { FileChangeWithUploadButton } from '../segments/FileChangeWithUploadButton.tsx';
import { RemoveFileButton } from '../segments/RemoveFileButton.tsx';
import { FlipGpxButton } from '../segments/FlipGpxButton.tsx';
import { ResetResolvedStreetsButton } from '../segments/ResetResolvedStreetsButton.tsx';
import { SplitSegmentDropdownItem } from '../segments/SplitSegment.tsx';
import { getClickOnSegment, getParsedGpxSegments } from '../store/segmentData.redux.ts';
import { useOnTheFlyCreatedGpx } from '../../utils/gpxUtil.ts';
import { EditSegmentColorButton } from '../segments/EditSegmentColor.tsx';

export const GpxSegmentContent = () => {
    const clickOnSegment = useSelector(getClickOnSegment);
    const segments = useSelector(getParsedGpxSegments);
    const clickedSegment = segments.find((segment) => segment.id === clickOnSegment?.segmentId);
    const gpxContent = useOnTheFlyCreatedGpx(clickedSegment);

    if (!clickedSegment) {
        return null;
    }
    const { id, filename, flipped } = clickedSegment;

    return (
        <div>
            <FileDownloaderDropdownItem content={gpxContent} name={`${filename}.gpx`} />
            <SplitSegmentDropdownItem />

            <FileChangeWithUploadButton id={id} name={filename} />
            <RemoveFileButton id={id} name={filename} />
            <FlipGpxButton id={id} name={filename} flipped={flipped} />
            <EditSegmentColorButton segment={clickedSegment} />
            <ResetResolvedStreetsButton id={id} name={filename} />
        </div>
    );
};
