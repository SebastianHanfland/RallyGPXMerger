import { createSelector } from '@reduxjs/toolkit';
import { getFilteredTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { ENTRY, isTrackEntryPoint, TrackEntry } from '../../../store/types.ts';
import { getTrackStreetInfos } from '../../../calculation/getTrackStreetInfos.ts';

export interface EntryPointPosition extends TrackEntry {
    point: { lat: number; lon: number };
    trackId: string;
    at: string;
}

export const getEntryPointPositions = createSelector(
    getFilteredTrackCompositions,
    getTrackStreetInfos,
    (trackCompositions, trackInfos): EntryPointPosition[] => {
        const breakPoints: EntryPointPosition[] = [];
        trackCompositions.forEach((track) => {
            track.segments.filter(isTrackEntryPoint).forEach((segment) => {
                const foundTrackInfo = trackInfos.find((trackInfo) => trackInfo.id === track.id);
                const foundBreak = foundTrackInfo?.wayPoints.find((wayPoint) => wayPoint.entryId === segment.id);
                if (foundBreak) {
                    breakPoints.push({
                        point: foundBreak.pointFrom,
                        id: segment.id,
                        trackId: track.id,
                        buffer: segment.buffer,
                        rounding: segment.rounding,
                        streetName: segment.streetName,
                        extraInfo: segment.extraInfo,
                        type: ENTRY,
                        at: foundBreak?.frontArrival ?? '',
                    });
                }
            });
        });
        return breakPoints;
    }
);
