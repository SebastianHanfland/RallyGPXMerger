import { ArrivalDateTimePicker } from './ArrivalDateTimePicker.tsx';
import { ParticipantsDelaySetter } from './ParticipantsDelaySetter.tsx';

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
            </div>
        </div>
    );
}
