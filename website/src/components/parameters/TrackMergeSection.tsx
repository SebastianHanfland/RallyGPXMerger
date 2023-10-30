import { ArrivalDateTimePicker } from './ArrivalDateTimePicker.tsx';
import { ParticipantsDelaySetter } from './ParticipantsDelaySetter.tsx';
import { AverageSpeedSetter } from './AverageSpeedSetter.tsx';
import { ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { MergeTracksButton } from '../MergeTracksButton.tsx';
import { CalculatedFilesDownloader } from '../CalculatedFilesDownloader.tsx';

export function TrackMergeSection() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Set rally parameters</h4>
            <div>
                <hr />
                <ArrivalDateTimePicker />
                <hr />
                <ParticipantsDelaySetter />
                <hr />
                <AverageSpeedSetter />
                <hr />
                <ButtonToolbar aria-label="Toolbar with Button groups" className={'justify-content-center'}>
                    <ButtonGroup aria-label="help-buttons">
                        <MergeTracksButton />
                        <CalculatedFilesDownloader />
                    </ButtonGroup>
                </ButtonToolbar>
            </div>
        </div>
    );
}
