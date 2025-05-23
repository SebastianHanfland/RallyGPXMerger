import { State, TrackComposition } from '../../store/types.ts';
import { getCurrenMapTime, getEndMapTime, getStartMapTime } from '../../store/map.reducer.ts';
import { getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import date from 'date-and-time';
import { getCalculatedTracks } from '../../store/calculatedTracks.reducer.ts';
import { getTrackCompositions } from '../../store/trackMerge.reducer.ts';
import { createSelector } from '@reduxjs/toolkit';
import { MAX_SLIDER_TIME } from '../../../common/constants.ts';
import { extractSnakeTrackFromParsedTrack } from '../../../common/logic/extractSnakeTrack.ts';
import { ParsedTrack } from '../../../common/types.ts';
import { BikeSnake } from '../../../common/map/addSnakeWithBikeToMap.ts';
import { getColorFromUuid } from '../../../utils/colorUtil.ts';
import { getParsedTracks } from '../../store/parsedTracks.reducer.ts';

const extractSnakeLocationForTimeStamp =
    (timeStampFront: string, trackCompositions: TrackComposition[]) =>
    (parsedTrack: ParsedTrack): BikeSnake => {
        const foundTrackComposition =
            trackCompositions.length > 0 ? trackCompositions.find((track) => track.id === parsedTrack.id) : undefined;
        const participants = foundTrackComposition?.peopleCount ?? 0;

        const trackId = foundTrackComposition?.id;
        return {
            points: extractSnakeTrackFromParsedTrack(timeStampFront, participants, parsedTrack),
            title: foundTrackComposition?.name ?? 'N/A',
            color: trackId ? getColorFromUuid(trackId) : 'white',
            id: trackId ?? 'id-not-found',
        };
    };

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

export const getBikeSnakesForPlanningMap = createSelector(
    getCurrentTimeStamp,
    getTrackCompositions,
    getParsedTracks,
    (timeStamp, trackParticipants, parsedTracks): BikeSnake[] => {
        if (!timeStamp) {
            return [];
        }
        return parsedTracks?.map(extractSnakeLocationForTimeStamp(timeStamp, trackParticipants)) ?? [];
    }
);
