import { MAX_SLIDER_TIME, State } from '../../store/types.ts';
import { getCurrenMapTime } from '../../store/map.reducer.ts';
import { getTimeDifferenceInSeconds } from '../../logic/dateUtil.ts';
import date from 'date-and-time';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { SimpleGPX } from '../../logic/SimpleGPX.ts';

function getStartAndEndOfSimulation(state: State): { start: string; end: string } {
    const calculatedTracks = getCalculatedTracks(state);
    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    calculatedTracks.forEach((track) => {
        const trackGpx = SimpleGPX.fromString(track.content);
        if (trackGpx.getStart() < startDate) {
            startDate = trackGpx.getStart();
        }

        if (trackGpx.getEnd() > endDate) {
            endDate = trackGpx.getEnd();
        }
    });

    return {
        start: startDate,
        end: endDate,
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
