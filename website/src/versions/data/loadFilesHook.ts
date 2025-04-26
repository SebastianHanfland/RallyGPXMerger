import { Dispatch } from '@reduxjs/toolkit';
import { mapActions } from '../store/map.reducer.ts';
import { DisplayState } from '../store/types.ts';
import { getParsedTracks } from '../store/displayTracksReducer.ts';

export function setStartAndEndTime(dispatch: Dispatch, getState: () => DisplayState) {
    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    const parsedTracks = getParsedTracks(getState());
    parsedTracks.forEach((track) => {
        const startTimeOfTrack = track.points[0].time;
        if (startTimeOfTrack < startDate) {
            startDate = startTimeOfTrack;
        }

        const endTimeOfTrack = track.points[track.points.length - 1].time;
        if (endTimeOfTrack > endDate) {
            endDate = endTimeOfTrack;
        }
    });

    const payload = {
        start: startDate,
        end: endDate,
    };
    if (
        endDate.startsWith(new Date().toISOString().substring(0, 10)) ||
        startDate.startsWith(new Date().toISOString().substring(0, 10))
    ) {
        dispatch(mapActions.setIsLive(true));
    }
    dispatch(mapActions.setStartAndEndTime(payload));
}
