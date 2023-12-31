import { IFrameState, MAX_SLIDER_TIME, State, TrackComposition } from '../../../store/types.ts';
import { getCurrenMapTime, getEndMapTime, getStartMapTime } from '../../../store/map.reducer.ts';
import { getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import date from 'date-and-time';
import { getCalculatedTracks } from '../../../store/calculatedTracks.reducer.ts';
import { Point } from 'gpxparser';
import { getTrackCompositions, PARTICIPANTS_DELAY_IN_SECONDS } from '../../../store/trackMerge.reducer.ts';
import { getReadableTracks, ReadableTrack } from '../../../logic/MergeCalculation.ts';
import { getResolvedPositions } from '../../../store/geoCoding.reducer.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getZipTracks } from '../../../store/zipTracks.reducer.ts';

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
    (timeStampFront: string, trackCompositions: TrackComposition[]) =>
    (readableTrack: ReadableTrack): { lat: number; lng: number }[] => {
        const participants =
            trackCompositions.length > 0
                ? trackCompositions.find((track) => track.id === readableTrack.id)?.peopleCount ?? 0
                : 0;
        let returnPoints: { lat: number; lng: number }[] = [];
        const timeStampEnd = date
            .addSeconds(new Date(timeStampFront), -participants * PARTICIPANTS_DELAY_IN_SECONDS)
            .toISOString();

        readableTrack.gpx.tracks.forEach((track) => {
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
        readableTracks?.forEach((readableTrack) => {
            readableTrack.gpx.tracks.forEach((track) => {
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

export const getZipCurrentTimeStamp = (state: IFrameState): string | undefined => {
    const calculatedTracks = getZipTracks(state);
    if (Object.keys(calculatedTracks).length === 0) {
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

export const getZipCurrentMarkerPositionsForTracks = createSelector(
    getZipCurrentTimeStamp,
    getZipTracks,
    getReadableTracks,
    (timeStamp, _, readableTracks) => {
        if (!timeStamp) {
            return [];
        }
        return readableTracks?.map(extractLocation(timeStamp, [])) ?? [];
    }
);
