import { FileDownloader } from './FileDownloader.tsx';

export function TrackDownloadSection() {
    return (
        <div>
            <h4>Download target files</h4>
            <FileDownloader name={'test'} content={'1234'} />
        </div>
    );
}
