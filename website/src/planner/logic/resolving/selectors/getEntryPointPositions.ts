import { createSelector } from '@reduxjs/toolkit';
import { getFilteredTrackCompositions, getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { ENTRY, isTrackEntryPoint, TrackEntry } from '../../../store/types.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';

export interface EntryPointPosition extends TrackEntry {
    point: { lat: number; lon: number };
    trackId: string;
    at: string;
    passageAt: string;
}

function calculateEntryPointPositions(
    trackCompositions: ReturnType<typeof getTrackCompositions>,
    trackInfos: ReturnType<typeof getTrackStreetInfos>
) {
    const entryPoints: EntryPointPosition[] = [];
    trackCompositions.forEach((track) => {
        track.segments.filter(isTrackEntryPoint).forEach((segment) => {
            const foundTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
            const foundEntryPoint = foundTrackInfo?.wayPoints.find((wayPoint) => wayPoint.entryId === segment.id);
            if (foundEntryPoint) {
                entryPoints.push({
                    point: foundEntryPoint.pointFrom,
                    id: segment.id,
                    trackId: track.id,
                    buffer: segment.buffer,
                    rounding: segment.rounding,
                    streetName: segment.streetName,
                    extraInfo: segment.extraInfo,
                    type: ENTRY,
                    at: foundEntryPoint?.frontArrival ?? '',
                    passageAt: foundEntryPoint?.frontPassage ?? '',
                });
            }
        });
    });
    return entryPoints;
}

export const getEntryPointPositions = createSelector(
    getFilteredTrackCompositions,
    getTrackStreetInfos,
    calculateEntryPointPositions
);

export const getAllEntryPointPositions = createSelector(
    getTrackCompositions,
    getTrackStreetInfos,
    calculateEntryPointPositions
);
