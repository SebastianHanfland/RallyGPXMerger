import { State, TrackComposition } from '../../store/types.ts';
import { getCurrenMapTime, getEndMapTime, getStartMapTime } from '../../store/map.reducer.ts';
import {
    getCurrenMapTime as zipGetCurrenMapTime,
    getEndMapTime as zipGetEndMapTime,
    getStartMapTime as zipGetStartMapTime,
} from '../../../versions/store/map.reducer.ts';
import { getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import date from 'date-and-time';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { getReadableTracks } from '../../../logic/MergeCalculation.ts';
import { getResolvedPositions } from '../../store/geoCoding.reducer.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getSelectedTracks, getSelectedVersions, getZipTracks } from '../../../versions/store/zipTracks.reducer.ts';
import { VersionsState, ZipTrack } from '../../../versions/store/types.ts';
import { MAX_SLIDER_TIME } from '../../../common/constants.ts';
import { extractSnakeTrack } from '../../../common/logic/extractSnakeTrack.ts';
import { ReadableTrack } from '../../../common/types.ts';

const extractLocation =
    (timeStampFront: string, trackCompositions: TrackComposition[]) =>
    (readableTrack: ReadableTrack): { lat: number; lng: number }[] => {
        const participants =
            trackCompositions.length > 0
                ? trackCompositions.find((track) => track.id === readableTrack.id)?.peopleCount ?? 0
                : 0;
        return extractSnakeTrack(timeStampFront, participants, readableTrack);
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

        return {
            trackPositions: extractSnakeTrack(timeStampFront, participants, readableTrack),
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
    const mapTime = zipGetCurrenMapTime(state) ?? 0;
    const start = zipGetStartMapTime(state);
    const end = zipGetEndMapTime(state);
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
