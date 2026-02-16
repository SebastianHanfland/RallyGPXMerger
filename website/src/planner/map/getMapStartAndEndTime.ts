import { createSelector } from '@reduxjs/toolkit';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { getStartAndEndOfParsedTracks } from '../../utils/parsedTracksUtil.ts';

export const getMapStartAndEndTime = createSelector(getCalculatedTracks, (tracks) => {
    return getStartAndEndOfParsedTracks(tracks);
});
