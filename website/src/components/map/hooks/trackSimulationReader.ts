import { MAX_SLIDER_TIME, State } from '../../../store/types.ts';
import { getCurrenMapTime } from '../../../store/map.reducer.ts';
import { getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import date from 'date-and-time';
import { getCalculatedTracks, getTrackParticipants } from '../../../store/calculatedTracks.reducer.ts';
import { SimpleGPX } from '../../../utils/SimpleGPX.ts';
import { Point } from 'gpxparser';
import { PARTICIPANTS_DELAY_IN_SECONDS } from '../../../store/trackMerge.reducer.ts';
import {
    getResolvedPositions,
    initializeResolvedPositions,
} from '../../../reverseGeoCoding/initializeResolvedPositions.ts';

let readableTracks: SimpleGPX[] | undefined = undefined;

export const clearReadableTracks = () => {
    readableTracks = undefined;
};

function getStartAndEndOfSimulation(state: State): { start: string; end: string } {
    const calculatedTracks = getCalculatedTracks(state);
    const trackParticipants = getTrackParticipants(state);
    const maxDelay = Math.min(...trackParticipants);

    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    if (!readableTracks) {
        readableTracks = calculatedTracks.map((track) => SimpleGPX.fromString(track.content));
        initializeResolvedPositions(readableTracks);
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
        end: date.addSeconds(new Date(endDate), maxDelay * PARTICIPANTS_DELAY_IN_SECONDS).toISOString(),
    };
}

export function interpolatePosition(previous: Point, next: Point, timeStamp: string) {
    const nextTime = next.time.toISOString();
    const previousTime = previous.time.toISOString();
    const timeRange = getTimeDifferenceInSeconds(previousTime, nextTime);
    const timePart = getTimeDifferenceInSeconds(previousTime, timeStamp);
    const percentage = timePart / timeRange;

    const interpolatedLat = previous.lat + percentage * (next.lat - previous.lat);
    const interpolatedLng = previous.lon + percentage * (next.lon - previous.lon);

    return { lat: interpolatedLat, lng: interpolatedLng };
}

const extractLocation =
    (timeStampFront: string, trackParticipants: number[]) =>
    (calculatedTrack: SimpleGPX, index: number): { lat: number; lng: number }[] => {
        const participants = trackParticipants[index];
        let returnPoints: { lat: number; lng: number }[] = [];
        const timeStampEnd = date
            .addSeconds(new Date(timeStampFront), -participants * PARTICIPANTS_DELAY_IN_SECONDS)
            .toISOString();

        calculatedTrack.tracks.forEach((track) => {
            track.points.forEach((point, index, points) => {
                if (index === 0) {
                    return;
                }
                const next = point.time.toISOString();
                const previous = points[index - 1].time.toISOString();

                if (previous < timeStampFront && timeStampFront < next) {
                    returnPoints.push(interpolatePosition(points[index - 1], point, timeStampFront));
                }
                if (previous < timeStampEnd && timeStampEnd < next) {
                    returnPoints.push(interpolatePosition(points[index - 1], point, timeStampEnd));
                }
                if (timeStampEnd < next && next < timeStampFront) {
                    returnPoints.push({ lat: point.lat, lng: point.lon });
                }
            });
        });
        return returnPoints;
    };

export const getCurrentMarkerPositionsForTracks = (state: State) => {
    const timeStamp = getCurrentTimeStamp(state);
    if (!timeStamp) {
        return [];
    }
    const trackParticipants = getTrackParticipants(state);
    return readableTracks?.map(extractLocation(timeStamp, trackParticipants)) ?? [];
};

export const getNumberOfPositionsInTracks = () => {
    let positionCount = 0;
    const positionMap = getResolvedPositions();
    readableTracks?.forEach((gpx) => {
        gpx.tracks.forEach((track) => {
            positionCount += track.points.length;
        });
    });
    return {
        uniquePositionCount: Object.keys(positionMap).length,
        positionCount,
        unresolvedUniquePositionCount: Object.values(positionMap).filter((value) => !value).length,
    };
};

export const getCurrentTimeStamp = (state: State): string | undefined => {
    const calculatedTracks = getCalculatedTracks(state);
    if (calculatedTracks.length === 0) {
        return;
    }
    const mapTime = getCurrenMapTime(state) ?? 0;
    const { start, end } = getStartAndEndOfSimulation(state);

    const percentage = mapTime / MAX_SLIDER_TIME;
    const secondsToAddToStart = getTimeDifferenceInSeconds(end, start) * percentage;
    return date.addSeconds(new Date(start), secondsToAddToStart).toISOString();
};
