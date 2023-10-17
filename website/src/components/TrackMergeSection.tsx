import { DummyTable } from './DummyTable.tsx';
import { Button } from 'react-bootstrap';
import { FileDownloader } from './FileDownloader.tsx';
import { calculateMerge } from '../logic/MergeCalculation.ts';

export function TrackMergeSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%' }}>
            <h4>Restructure files</h4>
            <div style={{ height: '70px' }}>
                <Button className={'m-2'} onClick={calculateMerge}>
                    Merge Tracks
                </Button>
                <FileDownloader name={'test'} content={'1234'} />
                <Button className={'m-2'}>Show Map</Button>
            </div>
            <DummyTable />
        </div>
    );
}
