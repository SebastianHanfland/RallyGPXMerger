import { ArrivalDateTimePicker } from './ArrivalDateTimePicker.tsx';
import { ParticipantsDelaySetter } from './ParticipantsDelaySetter.tsx';
import { AverageSpeedSetter } from './AverageSpeedSetter.tsx';

export function TrackMergeParameters() {
    return (
        <div className={'text-center'}>
            <ArrivalDateTimePicker />
            <hr />
            <ParticipantsDelaySetter />
            <hr />
            <AverageSpeedSetter />
        </div>
    );
}
