import { DummyTable } from './DummyTable.tsx';
import { Button } from 'react-bootstrap';

export function TrackMergeSection() {
    return (
        <div>
            <h4>Restructure files</h4>
            <div style={{ height: '70px' }}>
                <Button>Merge Tracks</Button>
            </div>
            <DummyTable />
        </div>
    );
}
