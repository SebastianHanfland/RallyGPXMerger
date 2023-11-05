import { MergeTable } from './MergeTable.tsx';
import { ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { MergeTracksButton } from '../MergeTracksButton.tsx';
import { CalculatedFilesDownloader } from '../CalculatedFilesDownloader.tsx';

export function TrackCompositionSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Create tracks from GPX segments</h4>
            <ButtonToolbar aria-label="Toolbar with Button groups" className={'m-2 justify-content-center'}>
                <ButtonGroup aria-label="help-buttons">
                    <MergeTracksButton />
                    <CalculatedFilesDownloader />
                </ButtonGroup>
            </ButtonToolbar>
            <MergeTable />
        </div>
    );
}
