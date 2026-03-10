import { TrackDelayDetails } from '../common/calculation/calculated-tracks/getSpecifiedDelayPerTrack.ts';
import { BREAK } from '../planner/store/types.ts';

export function getTotalDelay(delaysOfTrack: TrackDelayDetails): number {
    let countDelay = 0;
    delaysOfTrack.delays
        .filter((delay) => delay.by !== BREAK)
        .forEach((delay) => {
            countDelay += delay.extraDelay;
        });
    return countDelay;
}

export const compareDelays = (a: TrackDelayDetails, b: TrackDelayDetails) => {
    return getTotalDelay(a) > getTotalDelay(b) ? 1 : -1;
};
