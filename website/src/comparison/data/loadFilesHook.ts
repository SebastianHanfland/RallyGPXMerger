import { Dispatch } from '@reduxjs/toolkit';
import { getReadableTracks } from '../cache/readableTracks.ts';
import { mapActions } from '../store/map.reducer.ts';

export function setStartAndEndTime(dispatch: Dispatch) {
    let endDate = '1990-10-14T10:09:57.000Z';
    let startDate = '9999-10-14T10:09:57.000Z';

    // TODO-187: start and end time for each planning
    getReadableTracks()?.forEach((track) => {
        if (track.gpx.getStart() < startDate) {
            startDate = track.gpx.getStart();
        }

        if (track.gpx.getEnd() > endDate) {
            endDate = track.gpx.getEnd();
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
