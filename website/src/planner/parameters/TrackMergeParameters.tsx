import { ArrivalDateTimePicker } from './ArrivalDateTimePicker.tsx';
import { ParticipantsDelaySetter } from './ParticipantsDelaySetter.tsx';
import { AverageSpeedSetter } from './AverageSpeedSetter.tsx';
import { PlanningLabel } from './PlanningLabel.tsx';

export function TrackMergeParameters() {
    return (
        <div className={'text-center'}>
            <ArrivalDateTimePicker />
            <hr />
            <PlanningLabel />
            <hr />
            <ParticipantsDelaySetter />
            <hr />
            <AverageSpeedSetter />
        </div>
    );
}
