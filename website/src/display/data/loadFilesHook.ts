import { Dispatch } from '@reduxjs/toolkit';
import { displayMapActions } from '../store/displayMapReducer';
import { DisplayState } from '../store/types';
import { getDisplayTracks } from '../store/displayTracksReducer';
import { getStartAndEndOfParsedTracks } from '../../utils/parsedTracksUtil';

export function setStartAndEndTime(dispatch: Dispatch, getState: () => DisplayState) {
    const parsedTracks = getDisplayTracks(getState());
    const payload = getStartAndEndOfParsedTracks(parsedTracks);
    const todayDateString = new Date().toISOString().substring(0, 10);
    if (payload.end.startsWith(todayDateString) || payload.start.startsWith(todayDateString)) {
        dispatch(displayMapActions.setIsLive(true));
    }
    dispatch(displayMapActions.setStartAndEndTime(payload));
}
