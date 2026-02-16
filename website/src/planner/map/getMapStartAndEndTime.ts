import { createSelector } from '@reduxjs/toolkit';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';

export const getMapStartAndEndTime = createSelector(getCalculatedTracks, (tracks) => {
    let start: string | null = null;
    let end: string | null = null;
    tracks.forEach((track) => {
        const startOfTrack = track.points[0].t;
        const endOfTrack = track.points[track.points.length - 1].t;
        if (!start || start > startOfTrack) {
            start = startOfTrack;
        }
        if (!end || end < endOfTrack) {
            end = endOfTrack;
        }
    });
    return { start, end };
});
