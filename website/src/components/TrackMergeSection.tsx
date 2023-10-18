import { MergeTable } from './MergeTable.tsx';
import { Button } from 'react-bootstrap';
import { CalculatedFilesDownloader } from './CalculatedFilesDownloader.tsx';
import { MergeTracksButton } from './MergeTracksButton.tsx';

export function TrackMergeSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%' }}>
            <h4>Restructure files</h4>
            <div style={{ height: '70px' }}>
                <MergeTracksButton />
                <CalculatedFilesDownloader />
                <Button className={'m-2'}>Show Map</Button>
            </div>
            <MergeTable />
        </div>
    );
}
