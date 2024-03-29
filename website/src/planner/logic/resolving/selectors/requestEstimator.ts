import { State } from '../../../store/types.ts';
import { getGpxSegments } from '../../../store/gpxSegments.reducer.ts';
import { GpxSegment } from '../../../../common/types.ts';

function getNumberOfRequestsForSegments(gpxSegments: GpxSegment[]) {
    return gpxSegments.length;
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
