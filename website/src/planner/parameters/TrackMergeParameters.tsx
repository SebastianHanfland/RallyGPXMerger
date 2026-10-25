import { ParticipantsDelaySetter } from './ParticipantsDelaySetter';
import { AverageSpeedSetter } from './AverageSpeedSetter';

export function TrackMergeParameters() {
    return (
        <div className={'text-center'}>
            <ParticipantsDelaySetter />
            <hr />
            <AverageSpeedSetter />
        </div>
    );
}
