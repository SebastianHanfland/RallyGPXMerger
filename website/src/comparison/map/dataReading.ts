import { CalculatedTrack } from '../../common/types.ts';
import { ComparisonTrackState } from '../store/types.ts';
import { extractSnakeTrackFromCalculatedTrack } from '../../common/calculation/snake/extractSnakeTrack.ts';
import {
    getComparisonParsedTracks,
    getComparisonParticipantsDelay,
    getPlanningIds,
    getSelectedTracks,
    getSelectedVersions,
} from '../store/tracks.reducer.ts';
import {
    getComparisonMapStartAndEndTimes,
    getCurrenMapTime as getCurrenComparisonMapTime,
} from '../store/map.reducer.ts';
import { MAX_SLIDER_TIME } from '../../common/constants.ts';
import { getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import date from 'date-and-time';
import { createSelector } from '@reduxjs/toolkit';
import { BikeSnake } from '../../common/map/addSnakeWithBikeToMap.ts';
import { DELAY_PER_PERSON_IN_SECONDS } from '../../planner/store/constants.ts';

const extractLocationComparison =
    (timeStampsFront: Record<string, string>, participantsDelayInSeconds: Record<string, number | undefined>) =>
    (parsedTrack: CalculatedTrack): BikeSnake => {
        const participants = parsedTrack.peopleCount ?? 0;
        return {
            points: extractSnakeTrackFromCalculatedTrack(
                timeStampsFront[parsedTrack.version!],
                participants,
                parsedTrack,
                participantsDelayInSeconds[parsedTrack.version!] ?? DELAY_PER_PERSON_IN_SECONDS
            ),
            title: parsedTrack?.filename ?? 'N/A',
            color: parsedTrack?.color ?? 'white',
            id: parsedTrack?.id ?? 'id-not-found',
        };
    };
export const getCurrentComparisonTimeStamps = (state: ComparisonTrackState): Record<string, string> => {
    const mapTimes = getComparisonMapStartAndEndTimes(state);
    if (Object.values(mapTimes).length === 0) {
        return {};
    }

    const planningIds = getPlanningIds(state);
    const sliderNumber = getCurrenComparisonMapTime(state) ?? 0;
    const percentage = sliderNumber / MAX_SLIDER_TIME;

    const timeForPlanningIds: Record<string, string> = {};
    planningIds.forEach((planningId) => {
        const mapTime = mapTimes[planningId];
        if (mapTime) {
            const start = mapTime.start;
            const end = mapTime.end;
            const secondsToAddToStart = getTimeDifferenceInSeconds(end, start) * percentage;
            timeForPlanningIds[planningId] = date.addSeconds(new Date(start), secondsToAddToStart).toISOString();
        }
    });

    return timeForPlanningIds;
};

export const getBikeSnakesForDisplayMap = createSelector(
    getCurrentComparisonTimeStamps,
    getPlanningIds,
    getComparisonParsedTracks,
    getSelectedTracks,
    getSelectedVersions,
    getComparisonParticipantsDelay,
    (
        timeStamps,
        planningIds,
        parsedTracks,
        selectedTracks,
        selectedVersions,
        participantsDelayInSeconds
    ): BikeSnake[] => {
        const tracksToDisplayOnMap: CalculatedTrack[] = [];
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

        return tracksToDisplayOnMap.map(extractLocationComparison(timeStamps, participantsDelayInSeconds)) ?? [];
    }
);
