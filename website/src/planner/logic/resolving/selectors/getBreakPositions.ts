import { createSelector } from '@reduxjs/toolkit';
import { getFilteredTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { isTrackBreak } from '../../../store/types.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';

export interface BreakPosition {
    point: { lat: number; lon: number };
    breakId: string;
    trackId: string;
    minutes: number;
    description: string;
    hasToilet: boolean;
    at: string;
}

export const getBreakPositions = createSelector(
    getFilteredTrackCompositions,
    getTrackStreetInfos,
    (trackCompositions, trackInfos): BreakPosition[] => {
        const breakPoints: BreakPosition[] = [];
        trackCompositions.forEach((track) => {
            track.segments.filter(isTrackBreak).forEach((segment) => {
                const foundTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
                const foundBreak = foundTrackInfo?.wayPoints.find((wayPoint) => wayPoint.breakId === segment.id);
                if (foundBreak) {
                    breakPoints.push({
                        point: foundBreak.pointFrom,
                        breakId: segment.id,
                        trackId: track.id,
                        minutes: segment.minutes,
                        description: segment.description,
                        hasToilet: segment.hasToilet,
                        at: foundBreak?.frontArrival ?? '',
                    });
                }
            });
        });
        return breakPoints;
    }
);
