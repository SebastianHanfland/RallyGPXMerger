import { ParsedTrack } from '../../common/types.ts';
import { ComparisonTrackState } from '../store/types.ts';
import { extractSnakeTrackFromParsedTrack } from '../../common/logic/extractSnakeTrack.ts';
import {
    getComparisonParsedTracks,
    getComparisonTracks,
    getPlanningIds,
    getSelectedTracks,
    getSelectedVersions,
} from '../store/tracks.reducer.ts';
import {
    getCurrenMapTime as getCurrenComparisonMapTime,
    getEndComparisonMapTime,
    getStartComparisonMapTime,
} from '../store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../../common/constants.ts';
import { getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import date from 'date-and-time';
import { createSelector } from '@reduxjs/toolkit';
import { BikeSnake } from '../../common/map/addSnakeWithBikeToMap.ts';

const extractLocationComparison =
    (timeStampFront: string) =>
    (parsedTrack: ParsedTrack): BikeSnake => {
        const participants = parsedTrack.peopleCount ?? 0;
        return {
            points: extractSnakeTrackFromParsedTrack(timeStampFront, participants, parsedTrack),
            title: parsedTrack?.filename ?? 'N/A',
            color: parsedTrack?.color ?? 'white',
            id: parsedTrack?.id ?? 'id-not-found',
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

export const getBikeSnakesForDisplayMap = createSelector(
    getCurrentComparisonTimeStamp,
    getPlanningIds,
    getComparisonParsedTracks,
    getSelectedTracks,
    getSelectedVersions,
    (timeStamp, planningIds, parsedTracks, selectedTracks, selectedVersions): BikeSnake[] => {
        if (!timeStamp) {
            return [];
        }

        const tracksToDisplayOnMap: ParsedTrack[] = [];
        planningIds.forEach((planningId) => {
            if (selectedVersions.includes(planningId)) {
                const tracksOfPlanning = parsedTracks[planningId];
                const selectedTrackIdsOfPlanning = selectedTracks[planningId];
                if (selectedTrackIdsOfPlanning && selectedTrackIdsOfPlanning.length > 0) {
                    tracksToDisplayOnMap.push(
                        ...(tracksOfPlanning?.filter((track) => selectedTrackIdsOfPlanning.includes(track.id)) ?? [])
                    );
                } else {
                    tracksToDisplayOnMap.push(...(tracksOfPlanning ?? []));
                }
            }
        });

        return tracksToDisplayOnMap.map(extractLocationComparison(timeStamp)) ?? [];
    }
);
