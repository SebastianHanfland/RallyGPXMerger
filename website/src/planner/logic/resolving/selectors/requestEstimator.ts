import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../../../store/types.ts';
import { getGpxSegments } from '../../../store/gpxSegments.reducer.ts';
import { SimpleGPX } from '../../../../utils/SimpleGPX.ts';
import { splitListIntoSections } from '../helper/splitPointsService.ts';
import { geoCodingRequestsActions } from '../../../store/geoCodingRequests.reducer.ts';
import { GpxSegment } from '../../../../common/types.ts';

function getNumberOfRequestsForSegments(gpxSegments: GpxSegment[]) {
    let counter = 0;
    gpxSegments.forEach((segment) => {
        const gpx = SimpleGPX.fromString(segment.content);
        gpx.tracks.forEach((track) => {
            const listOfPoints = splitListIntoSections(track.points, 1000);
            listOfPoints.forEach(() => {
                counter += 1;
            });
        });
    });
    return counter;
}

export const estimateRequestsForStreetResolving = (dispatch: Dispatch, getState: () => State) => {
    const gpxSegments = getGpxSegments(getState()).filter((segment) => !segment.streetsResolved);
    const counter = getNumberOfRequestsForSegments(gpxSegments);
    dispatch(geoCodingRequestsActions.setNumberOfRequiredRequests(counter));
};

export const getRequestProgress = (state: State): undefined | number => {
    const gpxSegments = getGpxSegments(state);
    const allRequests = getNumberOfRequestsForSegments(gpxSegments);
    const resolvedRequests = getNumberOfRequestsForSegments(gpxSegments.filter((segment) => segment.streetsResolved));

    if (allRequests === 0) {
        return 100;
    }

    return (resolvedRequests / allRequests) * 100;
};
