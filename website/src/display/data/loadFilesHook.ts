import { Dispatch } from '@reduxjs/toolkit';
import { mapActions } from '../store/map.reducer.ts';
import { DisplayState } from '../store/types.ts';
import { getDisplayTracks } from '../store/displayTracksReducer.ts';
import { getStartAndEndOfParsedTracks } from '../../utils/parsedTracksUtil.ts';

export function setStartAndEndTime(dispatch: Dispatch, getState: () => DisplayState) {
    const parsedTracks = getDisplayTracks(getState());
    const payload = getStartAndEndOfParsedTracks(parsedTracks);
    const todayDateString = new Date().toISOString().substring(0, 10);
    if (payload.end.startsWith(todayDateString) || payload.start.startsWith(todayDateString)) {
        dispatch(mapActions.setIsLive(true));
    }
    dispatch(mapActions.setStartAndEndTime(payload));
}
