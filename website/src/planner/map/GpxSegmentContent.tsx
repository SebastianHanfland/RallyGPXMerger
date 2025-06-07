import { useSelector } from 'react-redux';
import { getClickOnSegment } from '../store/gpxSegments.reducer.ts';
import { FileDownloaderDropdownItem } from '../segments/FileDownloader.tsx';
import { FileChangeButton } from '../segments/FileChangeButton.tsx';
import { RemoveFileButton } from '../segments/RemoveFileButton.tsx';
import { FlipGpxButton } from '../segments/FlipGpxButton.tsx';
import { ResetResolvedStreetsButton } from '../segments/ResetResolvedStreetsButton.tsx';
import { SplitSegmentDropdownItem } from '../segments/SplitSegment.tsx';
import { getParsedGpxSegments } from '../new-store/segmentData.redux.ts';
import { useEffect, useState } from 'react';
import { getGpxContentStringFromParsedSegment } from '../../utils/SimpleGPXFromPoints.ts';

export const GpxSegmentContent = () => {
    const clickOnSegment = useSelector(getClickOnSegment);
    const segments = useSelector(getParsedGpxSegments);
    const clickedSegment = segments.find((segment) => segment.id === clickOnSegment?.segmentId);
    const [gpxContent, setGpxContent] = useState('');

    useEffect(() => {
        if (clickedSegment) {
            setGpxContent(getGpxContentStringFromParsedSegment(clickedSegment));
        }
    }, []);

    if (!clickedSegment) {
        return null;
    }
    const { id, filename, flipped } = clickedSegment;

    return (
        <div>
            <FileDownloaderDropdownItem content={gpxContent} name={`${filename}.gpx`} />
            <SplitSegmentDropdownItem />

            <FileChangeButton id={id} name={filename} />
            <RemoveFileButton id={id} name={filename} />
            <FlipGpxButton id={id} name={filename} flipped={flipped} />
            <ResetResolvedStreetsButton id={id} name={filename} />
        </div>
    );
};
