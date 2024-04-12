import { ReadableTrack, ZipTrack } from '../../common/types.ts';
import { VersionsState } from '../store/types.ts';
import { extractSnakeTrack } from '../../common/logic/extractSnakeTrack.ts';
import { getSelectedTracks, getSelectedVersions, getZipTracks } from '../store/zipTracks.reducer.ts';
import {
    getCurrenMapTime as zipGetCurrenMapTime,
    getCurrentRealTime,
    getEndMapTime as zipGetEndMapTime,
    getStartMapTime as zipGetStartMapTime,
} from '../store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../../common/constants.ts';
import { getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import date from 'date-and-time';
import { createSelector } from '@reduxjs/toolkit';

import { getReadableTracks } from '../cache/readableTracks.ts';

const extractLocationZip =
    (timeStampFront: string, zipTracks: Record<string, ZipTrack[] | undefined>) =>
    (
        readableTrack: ReadableTrack
    ): {
        trackPositions: { lat: number; lng: number }[];
        name: string;
        color: string;
    } => {
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

export const getDisplayTimeStamp = (state: VersionsState): string | undefined => {
    const sliderTimeStamp = getZipCurrentTimeStamp(state);
    const currentRealTime = getCurrentRealTime(state);
    return currentRealTime ?? sliderTimeStamp;
};

function filterForSelectedTracks(readableTracks: ReadableTrack[] | undefined, selectedTrackIds: string[]) {
    return readableTracks?.filter((track) => selectedTrackIds.includes(track.id));
}

export const getZipCurrentMarkerPositionsForTracks = createSelector(
    getDisplayTimeStamp,
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
