import { MergeTable } from './MergeTable.tsx';
import { Button } from 'react-bootstrap';
import { calculateMerge } from '../logic/MergeCalculation.ts';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store.ts';
import { CalculatedFilesDownloader } from './CalculatedFilesDownloader.tsx';

export function TrackMergeSection() {
    const dispatch: AppDispatch = useDispatch();
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%' }}>
            <h4>Restructure files</h4>
            <div style={{ height: '70px' }}>
                <Button className={'m-2'} onClick={() => dispatch(calculateMerge)}>
                    Merge Tracks
                </Button>
                <CalculatedFilesDownloader />
                <Button className={'m-2'}>Show Map</Button>
            </div>
            <MergeTable />
        </div>
    );
}
