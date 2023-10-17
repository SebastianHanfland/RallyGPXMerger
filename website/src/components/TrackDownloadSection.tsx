import { FileDownloader } from './FileDownloader.tsx';
import { Button } from 'react-bootstrap';

export function TrackDownloadSection() {
    return (
        <div>
            <h4>Download target files</h4>
            <Button>Merge Tracks</Button>
            <FileDownloader name={'test'} content={'1234'} />
        </div>
    );
}
