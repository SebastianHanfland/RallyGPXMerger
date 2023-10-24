import { MAX_SLIDER_TIME, State } from '../../store/types.ts';
import { getCurrenMapTime } from '../../store/map.reducer.ts';
import { getTimeDifferenceInSeconds } from '../../logic/dateUtil.ts';
import date from 'date-and-time';

function getStartAndEndOfSimulation(state: State): { start: string; end: string } {
    console.log(state.map.currentTime);
    return {
        start: '2007-10-14T10:09:57.000Z',
        end: '2007-10-14T14:09:57.000Z',
    };
}

export const getCurrentTimeStamp = (state: State): string => {
    const mapTime = getCurrenMapTime(state) ?? 0;
    const { start, end } = getStartAndEndOfSimulation(state);

    const percentage = mapTime / MAX_SLIDER_TIME;
    const secondsToAddToStart = getTimeDifferenceInSeconds(end, start) * percentage;
    console.log(start);
    return date.addSeconds(new Date(start), secondsToAddToStart).toISOString();
};
