import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import download from '../../assets/file-down.svg';
import { getGpxSegments } from '../../store/gpxSegments.reducer.ts';
import { downloadFilesInZip } from '../CalculatedFilesDownloader.tsx';

export const SegmentFilesDownloader = () => {
    const calculatedTracks = useSelector(getGpxSegments) ?? [];
    return (
        <Button
            onClick={() => downloadFilesInZip(calculatedTracks, 'Segments')}
            disabled={calculatedTracks.length === 0}
            title={'Download all GPX segments'}
        >
            <img src={download} className="m-1" alt="download file" color={'#ffffff'} />
            Download GPX Segments
        </Button>
    );
};
