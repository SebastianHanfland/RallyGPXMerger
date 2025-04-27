import { Dispatch } from '@reduxjs/toolkit';
import { mapActions } from '../store/map.reducer.ts';
import { DisplayState } from '../store/types.ts';
import { getParsedTracks } from '../store/displayTracksReducer.ts';
import { ParsedTrack } from '../../common/types.ts';

function getStartAndEndOfParsedTracks(parsedTracks: ParsedTrack[]) {
    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

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

    return {
        start: startDate,
        end: endDate,
    };
}

export function setStartAndEndTime(dispatch: Dispatch, getState: () => DisplayState) {
    const parsedTracks = getParsedTracks(getState());
    const payload = getStartAndEndOfParsedTracks(parsedTracks);
    const todayDateString = new Date().toISOString().substring(0, 10);
    if (payload.end.startsWith(todayDateString) || payload.start.startsWith(todayDateString)) {
        dispatch(mapActions.setIsLive(true));
    }
    dispatch(mapActions.setStartAndEndTime(payload));
}
