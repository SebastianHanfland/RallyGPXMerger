import { useSelector } from 'react-redux';
import { getClickOnSegment, getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { FileDownloaderDropdownItem } from '../segments/FileDownloader.tsx';
import { FileChangeButton } from '../segments/FileChangeButton.tsx';
import { RemoveFileButton } from '../segments/RemoveFileButton.tsx';
import { FlipGpxButton } from '../segments/FlipGpxButton.tsx';
import { ResetResolvedStreetsButton } from '../segments/ResetResolvedStreetsButton.tsx';
import { SplitSegmentDropdownItem } from '../segments/SplitSegment.tsx';

export const GpxSegmentContent = () => {
    const clickOnSegment = useSelector(getClickOnSegment);
    const segments = useSelector(getGpxSegments);
    const clickedSegment = segments.find((segment) => segment.id === clickOnSegment?.segmentId);

    if (!clickedSegment) {
        return null;
    }
    const { id, content, filename, streetsResolved, flipped } = clickedSegment;

    return (
        <div>
            <FileDownloaderDropdownItem content={content} name={`${filename}.gpx`} />
            <SplitSegmentDropdownItem />

            <FileChangeButton id={id} name={filename} />
            <RemoveFileButton id={id} name={filename} />
            <FlipGpxButton id={id} name={filename} flipped={flipped} />
            <ResetResolvedStreetsButton id={id} name={filename} streetsResolved={streetsResolved} />
        </div>
    );
};
