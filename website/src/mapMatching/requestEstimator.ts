import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import {
    geoCodingActions,
    getNumberOfRequestsDone,
    getNumberOfRequestsRunning,
    getNumberOfRequiredRequests,
} from '../store/geoCoding.reducer.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { splitListIntoSections } from './splitPointsService.ts';

export const estimateRequestsForStreetResolving = (dispatch: Dispatch, getState: () => State) => {
    let counter = 0;
    const gpxSegments = getGpxSegments(getState());
    gpxSegments.forEach((segment) => {
        const gpx = SimpleGPX.fromString(segment.content);
        gpx.tracks.forEach((track) => {
            const listOfPoints = splitListIntoSections(track.points, 1000);
            listOfPoints.forEach(() => {
                counter += 1;
            });
        });
    });
    dispatch(geoCodingActions.setNumberOfRequiredRequests(counter));
};

export const getRequestProgress = (state: State): undefined | number => {
    const numberOfRequiredRequests = getNumberOfRequiredRequests(state);
    const numberOfRequestsDone = getNumberOfRequestsDone(state);
    const numberOfRequestsRunning = getNumberOfRequestsRunning(state);

    if (numberOfRequestsRunning === 0 && numberOfRequiredRequests === 0) {
        return 0;
    }
    if (!!numberOfRequiredRequests && numberOfRequestsDone === numberOfRequiredRequests) {
        return 100;
    }
    if (numberOfRequestsRunning === 0 || !numberOfRequiredRequests) {
        return 0;
    }

    return (numberOfRequestsDone / numberOfRequiredRequests) * 100;
};
