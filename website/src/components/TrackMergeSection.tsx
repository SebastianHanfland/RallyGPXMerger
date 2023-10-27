import { CalculatedFilesDownloader } from './CalculatedFilesDownloader.tsx';
import { MergeTracksButton } from './MergeTracksButton.tsx';
import { RemoveDataButton } from './RemoveDataButton.tsx';
import { ArrivalDateTimePicker } from './ArrivalDateTimePicker.tsx';
import { ParticipantsDelaySetter } from './ParticipantsDelaySetter.tsx';

export function TrackMergeSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Restructure files</h4>
            <div style={{ height: '70px' }}>
                <ArrivalDateTimePicker />
                <ParticipantsDelaySetter />
                <MergeTracksButton />
                <CalculatedFilesDownloader />
                <RemoveDataButton />
            </div>
        </div>
    );
}
