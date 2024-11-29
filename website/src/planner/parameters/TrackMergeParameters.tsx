import { ParticipantsDelaySetter } from './ParticipantsDelaySetter.tsx';
import { AverageSpeedSetter } from './AverageSpeedSetter.tsx';

export function TrackMergeParameters() {
    return (
        <div className={'text-center'}>
            <ParticipantsDelaySetter />
            <hr />
            <AverageSpeedSetter />
        </div>
    );
}
