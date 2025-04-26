import { DisplayTrack, ReadableTrack } from '../../common/types.ts';
import { VersionsState } from '../store/types.ts';
import { extractSnakeTrack } from '../../common/logic/extractSnakeTrack.ts';
import { getZipTracks } from '../store/zipTracks.reducer.ts';
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
    (timeStampFront: string, zipTracks: DisplayTrack[] | undefined) =>
    (readableTrack: ReadableTrack): BikeSnake => {
        const foundTrack = zipTracks?.find((track) => readableTrack.id.includes(track.id));
        const participants = foundTrack?.peopleCount ?? 0;

        return {
            points: extractSnakeTrack(timeStampFront, participants, readableTrack),
            title: foundTrack?.filename ?? 'N/A',
            color: foundTrack?.color ?? 'white',
            id: foundTrack?.id ?? 'id-not-found',
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
    const isLive = getIsLive(state);
    return isLive ? currentRealTime : sliderTimeStamp;
};

export const getBikeSnakesForDisplayMap = createSelector(
    getDisplayTimeStamp,
    getZipTracks,
    getReadableTracks,
    (timeStamp, zipTracks, readableTracks): BikeSnake[] => {
        if (!timeStamp) {
            return [];
        }

        return readableTracks?.map(extractLocationZip(timeStamp, zipTracks)) ?? [];
    }
);
