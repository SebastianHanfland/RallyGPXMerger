import { MAX_SLIDER_TIME, State, TrackComposition } from '../../../store/types.ts';
import { getCurrenMapTime, getEndMapTime, getStartMapTime } from '../../../store/map.reducer.ts';
import { getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import date from 'date-and-time';
import { getCalculatedTracks } from '../../../store/calculatedTracks.reducer.ts';
import { SimpleGPX } from '../../../utils/SimpleGPX.ts';
import { Point } from 'gpxparser';
import { getTrackCompositions, PARTICIPANTS_DELAY_IN_SECONDS } from '../../../store/trackMerge.reducer.ts';
import { getReadableTracks } from '../../../logic/MergeCalculation.ts';
import { getResolvedPositions } from '../../../store/geoCoding.reducer.ts';
import { createSelector } from '@reduxjs/toolkit';

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
    (timeStampFront: string, trackParticipants: TrackComposition[]) =>
    (calculatedTrack: SimpleGPX, index: number): { lat: number; lng: number }[] => {
        const participants = trackParticipants[index].peopleCount ?? 0;
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

export const getNumberOfPositionsInTracks = createSelector(
    getResolvedPositions,
    getReadableTracks,
    (positionMap, readableTracks) => {
        let positionCount = 0;
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
    }
);

export const getCurrentTimeStamp = (state: State): string | undefined => {
    const calculatedTracks = getCalculatedTracks(state);
    if (calculatedTracks.length === 0) {
        return;
    }
    const mapTime = getCurrenMapTime(state) ?? 0;
    const start = getStartMapTime(state);
    const end = getEndMapTime(state);
    if (!start || !end) {
        return undefined;
    }

    const percentage = mapTime / MAX_SLIDER_TIME;
    const secondsToAddToStart = getTimeDifferenceInSeconds(end, start) * percentage;
    return date.addSeconds(new Date(start), secondsToAddToStart).toISOString();
};

export const getCurrentMarkerPositionsForTracks = createSelector(
    getCurrentTimeStamp,
    getTrackCompositions,
    getReadableTracks,
    (timeStamp, trackParticipants, readableTracks) => {
        if (!timeStamp) {
            return [];
        }
        return readableTracks?.map(extractLocation(timeStamp, trackParticipants)) ?? [];
    }
);
