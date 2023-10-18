import { MergeTable } from './MergeTable.tsx';
import { Button, Form } from 'react-bootstrap';
import { CalculatedFilesDownloader } from './CalculatedFilesDownloader.tsx';
import { MergeTracksButton } from './MergeTracksButton.tsx';
import { RemoveDataButton } from './RemoveDataButton.tsx';

interface Props {
    setShowMap: () => void;
}
export function TrackMergeSection(props: Props) {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%' }}>
            <h4>Restructure files</h4>
            <div style={{ height: '70px' }}>
                <Button variant={'light'}>
                    <Form.Control
                        type="datetime"
                        placeholder="Arrival Time and Date"
                        style={{ width: '300px' }}
                        value={'19.05.2024 14:00'}
                    />
                </Button>
                <MergeTracksButton />
                <CalculatedFilesDownloader />
                <Button className={'m-2'} onClick={props.setShowMap}>
                    Show Map
                </Button>
                <RemoveDataButton />
            </div>
            <MergeTable />
        </div>
    );
}
