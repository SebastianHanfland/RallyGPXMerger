import { State } from '../../../store/types.ts';
import { getGpxSegments } from '../../../store/gpxSegments.reducer.ts';
import { SimpleGPX } from '../../../../utils/SimpleGPX.ts';
import { splitListIntoSections } from '../helper/splitPointsService.ts';
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

export const getNumberOfRequiredRequests = (state: State) => {
    const gpxSegments = getGpxSegments(state).filter((segment) => !segment.streetsResolved);
    return getNumberOfRequestsForSegments(gpxSegments);
};

export const getRequestProgress = (state: State): undefined | number => {
    const gpxSegments = getGpxSegments(state);
    const allRequests = getNumberOfRequestsForSegments(gpxSegments);
    const resolvedRequests = getNumberOfRequestsForSegments(gpxSegments.filter((segment) => segment.streetsResolved));

    if (allRequests === 0) {
        return 0;
    }

    return (resolvedRequests / allRequests) * 100;
};
