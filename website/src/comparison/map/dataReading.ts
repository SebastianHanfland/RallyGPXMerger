import { ReadableTrack, DisplayTrack } from '../../common/types.ts';
import { ComparisonTrackState } from '../store/types.ts';
import { extractSnakeTrack } from '../../common/logic/extractSnakeTrack.ts';
import { getSelectedTracks, getSelectedVersions, getComparisonTracks } from '../store/tracks.reducer.ts';
import {
    getCurrenMapTime as getCurrenComparisonMapTime,
    getCurrentRealTime,
    getEndComparisonMapTime,
    getIsLive,
    getStartComparisonMapTime,
} from '../store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../../common/constants.ts';
import { getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import date from 'date-and-time';
import { createSelector } from '@reduxjs/toolkit';

import { getReadableTracks } from '../cache/readableTracks.ts';
import { BikeSnake } from '../../common/map/addSnakeWithBikeToMap.ts';

const extractLocationComparison =
    (timeStampFront: string, comparisonTracks: Record<string, DisplayTrack[] | undefined>) =>
    (readableTrack: ReadableTrack): BikeSnake => {
        let foundTrack: DisplayTrack | undefined;
        Object.values(comparisonTracks).forEach((tracks) => {
            const find = tracks?.find((track) => readableTrack.id.includes(track.id));
            if (find) {
                foundTrack = find;
            }
        });
        const participants = foundTrack?.peopleCount ?? 0;

        return {
            points: extractSnakeTrack(timeStampFront, participants, readableTrack),
            title: foundTrack?.filename ?? 'N/A',
            color: foundTrack?.color ?? 'white',
            id: foundTrack?.id ?? 'id-not-found',
        };
    };
export const getCurrentComparisonTimeStamp = (state: ComparisonTrackState): string | undefined => {
    const calculatedTracks = getComparisonTracks(state);
    if (Object.keys(calculatedTracks).length === 0) {
        return;
    }
    const mapTime = getCurrenComparisonMapTime(state) ?? 0;
    const start = getStartComparisonMapTime(state);
    const end = getEndComparisonMapTime(state);
    if (!start || !end) {
        return undefined;
    }

    const percentage = mapTime / MAX_SLIDER_TIME;
    const secondsToAddToStart = getTimeDifferenceInSeconds(end, start) * percentage;
    return date.addSeconds(new Date(start), secondsToAddToStart).toISOString();
};

export const getDisplayTimeStamp = (state: ComparisonTrackState): string | undefined => {
    const sliderTimeStamp = getCurrentComparisonTimeStamp(state);
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
    getComparisonTracks,
    getReadableTracks,
    getSelectedTracks,
    getSelectedVersions,
    (timeStamp, comparisonTracks, readableTracks, selectedTracks, selectedVersions): BikeSnake[] => {
        if (!timeStamp) {
            return [];
        }
        const selectedTrackIds = selectedVersions.flatMap((version) => {
            const trackIdsOfVersion = comparisonTracks[version]?.map((track) => track.id) ?? [];
            if ((selectedTracks[version]?.length ?? 0) === 0) {
                return trackIdsOfVersion;
            }
            return selectedTracks[version] ?? [];
        });

        return (
            filterForSelectedTracks(readableTracks, selectedTrackIds)?.map(
                extractLocationComparison(timeStamp, comparisonTracks)
            ) ?? []
        );
    }
);
