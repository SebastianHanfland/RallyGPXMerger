import { ParsedTrack } from '../../common/types.ts';
import { DisplayState } from '../store/types.ts';
import { extractSnakeTrackFromCalculatedTrack } from '../../common/logic/extractSnakeTrack.ts';
import { getParsedTracks } from '../store/displayTracksReducer.ts';
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

import { BikeSnake } from '../../common/map/addSnakeWithBikeToMap.ts';

const extractLocationDisplay =
    (timeStampFront: string) =>
    (parsedTrack: ParsedTrack): BikeSnake => {
        const participants = parsedTrack?.peopleCount ?? 0;

        return {
            points: extractSnakeTrackFromCalculatedTrack(timeStampFront, participants, parsedTrack),
            title: parsedTrack.filename,
            color: parsedTrack.color ?? 'white',
            id: parsedTrack.id,
        };
    };

export const getCurrentDisplayTimeStamp = (state: DisplayState): string | undefined => {
    const calculatedTracks = getParsedTracks(state);
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

export const getDisplayTimeStamp = (state: DisplayState): string | undefined => {
    const sliderTimeStamp = getCurrentDisplayTimeStamp(state);
    const currentRealTime = getCurrentRealTime(state);
    const isLive = getIsLive(state);
    return isLive ? currentRealTime : sliderTimeStamp;
};

export const getBikeSnakesForDisplayMap = createSelector(
    getDisplayTimeStamp,
    getParsedTracks,
    (timeStamp, parsedTracks): BikeSnake[] => {
        if (!timeStamp) {
            return [];
        }

        return parsedTracks?.map(extractLocationDisplay(timeStamp)) ?? [];
    }
);
