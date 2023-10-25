import { MAX_SLIDER_TIME, State } from '../../store/types.ts';
import { getCurrenMapTime } from '../../store/map.reducer.ts';
import { getTimeDifferenceInSeconds } from '../../logic/dateUtil.ts';
import date from 'date-and-time';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { SimpleGPX } from '../../logic/SimpleGPX.ts';

let readableTracks: SimpleGPX[] | undefined = undefined;

export const clearReadableTracks = () => {
    readableTracks = undefined;
};
function getStartAndEndOfSimulation(state: State): { start: string; end: string } {
    const calculatedTracks = getCalculatedTracks(state);
    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    console.log('Triggered');

    if (!readableTracks) {
        readableTracks = calculatedTracks.map((track) => SimpleGPX.fromString(track.content));
    }

    readableTracks.forEach((track) => {
        if (track.getStart() < startDate) {
            startDate = track.getStart();
        }

        if (track.getEnd() > endDate) {
            endDate = track.getEnd();
        }
    });

    return {
        start: startDate,
        end: endDate,
    };
}

const extractLocation =
    (timeStamp: string) =>
    (calculatedTrack: SimpleGPX): { lat: number; lng: number } => {
        let returnPoint = { lat: 0, lng: 0 };
        calculatedTrack.tracks.forEach((track) => {
            track.points.forEach((point, index, points) => {
                if (index === 0) {
                    return;
                }
                const next = point.time.toISOString();
                const previous = points[index - 1].time.toISOString();
                if (timeStamp > previous && timeStamp < next) {
                    returnPoint = { lat: point.lat, lng: point.lon };
                }
            });
        });
        return returnPoint;
    };

export const getCurrentMarkerPositionsForTracks = (state: State) => {
    const timeStamp = getCurrentTimeStamp(state);
    return readableTracks?.map(extractLocation(timeStamp)) ?? [];
};

export const getCurrentTimeStamp = (state: State): string => {
    const mapTime = getCurrenMapTime(state) ?? 0;
    const { start, end } = getStartAndEndOfSimulation(state);

    const percentage = mapTime / MAX_SLIDER_TIME;
    const secondsToAddToStart = getTimeDifferenceInSeconds(end, start) * percentage;
    console.log(start);
    return date.addSeconds(new Date(start), secondsToAddToStart).toISOString();
};
