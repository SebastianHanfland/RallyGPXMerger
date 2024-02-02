import { ArrivalDateTimePicker } from './ArrivalDateTimePicker.tsx';
import { ParticipantsDelaySetter } from './ParticipantsDelaySetter.tsx';
import { AverageSpeedSetter } from './AverageSpeedSetter.tsx';
import { PlanningLabel } from './PlanningLabel.tsx';

export function TrackMergeParameters() {
    return (
        <div className={'m-2 p-2 shadow'} style={{ height: '95%', overflow: 'auto' }}>
            <h4>Set rally parameters</h4>
            <div>
                <hr />
                <ArrivalDateTimePicker />
                <hr />
                <PlanningLabel />
                <hr />
                <ParticipantsDelaySetter />
                <hr />
                <AverageSpeedSetter />
                <hr />
            </div>
        </div>
    );
}
