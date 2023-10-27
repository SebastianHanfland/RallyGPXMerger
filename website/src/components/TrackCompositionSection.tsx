import { MergeTable } from './MergeTable.tsx';

export function TrackCompositionSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Restructure files</h4>
            <MergeTable />
        </div>
    );
}
