import { MAX_SLIDER_TIME, State, TrackComposition } from '../../../planner/store/types.ts';
import { getCurrenMapTime, getEndMapTime, getStartMapTime } from '../../../planner/store/map.reducer.ts';
import { getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import date from 'date-and-time';
import { getCalculatedTracks } from '../../../planner/store/calculatedTracks.reducer.ts';
import { Point, Track } from 'gpxparser';
import { getTrackCompositions, PARTICIPANTS_DELAY_IN_SECONDS } from '../../../planner/store/trackMerge.reducer.ts';
import { getReadableTracks, ReadableTrack } from '../../../logic/MergeCalculation.ts';
import { getResolvedPositions } from '../../../planner/store/geoCoding.reducer.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getSelectedTracks, getSelectedVersions, getZipTracks } from '../../../versions/store/zipTracks.reducer.ts';
import { VersionsState, ZipTrack } from '../../../versions/store/types';

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

        let lastTrack: Track | null = null;
        readableTrack.gpx.tracks.forEach((track) => {
            if (lastTrack !== null) {
                const lastPointOfLastTrack = lastTrack.points[lastTrack.points.length - 1];
                const firstPointNextTrack = track.points[0];
                if (
                    timeStampFront > lastPointOfLastTrack.time.toISOString() &&
                    timeStampFront < firstPointNextTrack.time.toISOString()
                ) {
                    returnPoints.push({ lat: lastPointOfLastTrack.lat, lng: lastPointOfLastTrack.lon });
                }
            }
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
            lastTrack = track;
        });
        return returnPoints;
    };

const extractLocationZip =
    (timeStampFront: string, zipTracks: Record<string, ZipTrack[] | undefined>) =>
    (readableTrack: ReadableTrack): { trackPositions: { lat: number; lng: number }[]; name: string; color: string } => {
        let foundZipTrack: ZipTrack | undefined;
        Object.values(zipTracks).forEach((tracks) => {
            const find = tracks?.find((track) => track.id === readableTrack.id);
            if (find) {
                foundZipTrack = find;
            }
        });
        const participants = foundZipTrack?.peopleCount ?? 0;

        let returnPoints: { lat: number; lng: number }[] = [];
        const timeStampEnd = date
            .addSeconds(new Date(timeStampFront), -participants * PARTICIPANTS_DELAY_IN_SECONDS)
            .toISOString();

        let lastTrack: Track | null = null;
        readableTrack.gpx.tracks.forEach((track) => {
            if (lastTrack !== null) {
                const lastPointOfLastTrack = lastTrack.points[lastTrack.points.length - 1];
                const firstPointNextTrack = track.points[0];
                if (
                    timeStampFront > lastPointOfLastTrack.time.toISOString() &&
                    timeStampFront < firstPointNextTrack.time.toISOString()
                ) {
                    returnPoints.push({ lat: lastPointOfLastTrack.lat, lng: lastPointOfLastTrack.lon });
                }
            }
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
            lastTrack = track;
        });
        return {
            trackPositions: returnPoints,
            name: foundZipTrack?.filename ?? 'N/A',
            color: foundZipTrack?.color ?? 'white',
        };
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

export const getZipCurrentTimeStamp = (state: VersionsState): string | undefined => {
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

function filterForSelectedTracks(readableTracks: ReadableTrack[] | undefined, selectedTrackIds: string[]) {
    return readableTracks?.filter((track) => selectedTrackIds.includes(track.id));
}

export const getZipCurrentMarkerPositionsForTracks = createSelector(
    getZipCurrentTimeStamp,
    getZipTracks,
    getReadableTracks,
    getSelectedTracks,
    getSelectedVersions,
    (timeStamp, zipTracks, readableTracks, selectedTracks, selectedVersions) => {
        if (!timeStamp) {
            return [];
        }
        const selectedTrackIds = selectedVersions.flatMap((version) => {
            const trackIdsOfVersion = zipTracks[version]?.map((track) => track.id) ?? [];
            if ((selectedTracks[version]?.length ?? 0) === 0) {
                return trackIdsOfVersion;
            }
            return selectedTracks[version] ?? [];
        });

        return (
            filterForSelectedTracks(readableTracks, selectedTrackIds)?.map(extractLocationZip(timeStamp, zipTracks)) ??
            []
        );
    }
);
