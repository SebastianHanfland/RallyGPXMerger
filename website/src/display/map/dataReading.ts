import { CalculatedTrack } from '../../common/types';
import { DisplayState } from '../store/types';
import { extractSnakeTrackFromCalculatedTrack } from '../../common/calculation/snake/extractSnakeTrack';
import { getDisplayParticipantsDelay, getDisplayTracks } from '../store/displayTracksReducer';
import {
    getCurrenDisplayMapTime,
    getCurrentRealTime,
    getEndDisplayMapTime,
    getIsLive,
    getStartDisplayMapTime,
} from '../store/displayMapReducer';
import { MAX_SLIDER_TIME } from '../../common/constants';
import { getTimeDifferenceInSeconds } from '../../utils/dateUtil';
import { addSeconds } from 'date-and-time';
import { createSelector } from '@reduxjs/toolkit';

import { BikeSnake } from '../../common/map/addSnakeWithBikeToMap';
import { getColor } from '../../utils/colorUtil';

const extractLocationDisplay =
    (timeStampFront: string, participantsDelayInSeconds: number) =>
    (parsedTrack: CalculatedTrack): BikeSnake => {
        const participants = parsedTrack?.peopleCount ?? 0;

        return {
            points: extractSnakeTrackFromCalculatedTrack(
                timeStampFront,
                participants,
                parsedTrack,
                participantsDelayInSeconds
            ),
            title: parsedTrack.filename,
            color: getColor(parsedTrack),
            id: parsedTrack.id,
        };
    };

export const getCurrentDisplayTimeStamp = (state: DisplayState): string | undefined => {
    const displayTracks = getDisplayTracks(state);
    if (Object.keys(displayTracks).length === 0) {
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
    return addSeconds(new Date(start), secondsToAddToStart).toISOString();
};

export const getDisplayTimeStamp = (state: DisplayState): string | undefined => {
    const sliderTimeStamp = getCurrentDisplayTimeStamp(state);
    const currentRealTime = getCurrentRealTime(state);
    const isLive = getIsLive(state);
    return isLive ? currentRealTime : sliderTimeStamp;
};

export const getBikeSnakesForDisplayMap = createSelector(
    getDisplayTimeStamp,
    getDisplayTracks,
    getDisplayParticipantsDelay,
    (timeStamp, parsedTracks, participantsDelayInSeconds): BikeSnake[] => {
        if (!timeStamp) {
            return [];
        }

        return parsedTracks?.map(extractLocationDisplay(timeStamp, participantsDelayInSeconds)) ?? [];
    }
);
