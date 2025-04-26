import { ReadableTrack, DisplayTrack } from '../../common/types.ts';
import { ComparisonState } from '../store/types.ts';
import { extractSnakeTrack } from '../../common/logic/extractSnakeTrack.ts';
import { getSelectedTracks, getSelectedVersions, getZipTracks } from '../store/tracks.reducer.ts';
import {
    getCurrenMapTime as zipGetCurrenMapTime,
    getCurrentRealTime,
    getEndMapTime as zipGetEndMapTime,
    getIsLive,
    getStartMapTime as zipGetStartMapTime,
} from '../store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../../common/constants.ts';
import { getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import date from 'date-and-time';
import { createSelector } from '@reduxjs/toolkit';

import { getReadableTracks } from '../cache/readableTracks.ts';
import { BikeSnake } from '../../common/map/addSnakeWithBikeToMap.ts';

const extractLocationZip =
    (timeStampFront: string, zipTracks: Record<string, DisplayTrack[] | undefined>) =>
    (readableTrack: ReadableTrack): BikeSnake => {
        let foundZipTrack: DisplayTrack | undefined;
        Object.values(zipTracks).forEach((tracks) => {
            const find = tracks?.find((track) => readableTrack.id.includes(track.id));
            if (find) {
                foundZipTrack = find;
            }
        });
        const participants = foundZipTrack?.peopleCount ?? 0;

        return {
            points: extractSnakeTrack(timeStampFront, participants, readableTrack),
            title: foundZipTrack?.filename ?? 'N/A',
            color: foundZipTrack?.color ?? 'white',
            id: foundZipTrack?.id ?? 'id-not-found',
        };
    };
export const getZipCurrentTimeStamp = (state: ComparisonState): string | undefined => {
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

export const getDisplayTimeStamp = (state: ComparisonState): string | undefined => {
    const sliderTimeStamp = getZipCurrentTimeStamp(state);
    const currentRealTime = getCurrentRealTime(state);
    const isLive = getIsLive(state);
    return isLive ? currentRealTime : sliderTimeStamp;
};

function filterForSelectedTracks(readableTracks: ReadableTrack[] | undefined, selectedTrackIds: string[]) {
    return readableTracks?.filter((track) => {
        return selectedTrackIds.some((id) => track.id.includes(id));
    });
}

export const getBikeSnakesForDisplayMap = createSelector(
    getDisplayTimeStamp,
    getZipTracks,
    getReadableTracks,
    getSelectedTracks,
    getSelectedVersions,
    (timeStamp, zipTracks, readableTracks, selectedTracks, selectedVersions): BikeSnake[] => {
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
