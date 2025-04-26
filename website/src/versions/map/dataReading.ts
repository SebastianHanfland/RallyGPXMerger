import { DisplayTrack, ReadableTrack } from '../../common/types.ts';
import { VersionsState } from '../store/types.ts';
import { extractSnakeTrack } from '../../common/logic/extractSnakeTrack.ts';
import { getDisplayTracks } from '../store/displayTracksReducer.ts';
import {
    getCurrenDisplayMapTime,
    getCurrentRealTime,
    getEndDisplayMapTime,
    getIsLive,
    getStartDisplayMapTime,
} from '../store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../../common/constants.ts';
import { getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import date from 'date-and-time';
import { createSelector } from '@reduxjs/toolkit';

import { getReadableTracks } from '../cache/readableTracks.ts';
import { BikeSnake } from '../../common/map/addSnakeWithBikeToMap.ts';

const extractLocationDisplay =
    (timeStampFront: string, displayTracks: DisplayTrack[] | undefined) =>
    (readableTrack: ReadableTrack): BikeSnake => {
        const foundTrack = displayTracks?.find((track) => readableTrack.id.includes(track.id));
        const participants = foundTrack?.peopleCount ?? 0;

        return {
            points: extractSnakeTrack(timeStampFront, participants, readableTrack),
            title: foundTrack?.filename ?? 'N/A',
            color: foundTrack?.color ?? 'white',
            id: foundTrack?.id ?? 'id-not-found',
        };
    };
export const getCurrentDisplayTimeStamp = (state: VersionsState): string | undefined => {
    const calculatedTracks = getDisplayTracks(state);
    if (Object.keys(calculatedTracks).length === 0) {
        return;
    }
    const mapTime = getCurrenDisplayMapTime(state) ?? 0;
    const start = getStartDisplayMapTime(state);
    const end = getEndDisplayMapTime(state);
    if (!start || !end) {
        return undefined;
    }

    const percentage = mapTime / MAX_SLIDER_TIME;
    const secondsToAddToStart = getTimeDifferenceInSeconds(end, start) * percentage;
    return date.addSeconds(new Date(start), secondsToAddToStart).toISOString();
};

export const getDisplayTimeStamp = (state: VersionsState): string | undefined => {
    const sliderTimeStamp = getCurrentDisplayTimeStamp(state);
    const currentRealTime = getCurrentRealTime(state);
    const isLive = getIsLive(state);
    return isLive ? currentRealTime : sliderTimeStamp;
};

export const getBikeSnakesForDisplayMap = createSelector(
    getDisplayTimeStamp,
    getDisplayTracks,
    getReadableTracks,
    (timeStamp, displayTracks, readableTracks): BikeSnake[] => {
        if (!timeStamp) {
            return [];
        }

        return readableTracks?.map(extractLocationDisplay(timeStamp, displayTracks)) ?? [];
    }
);
