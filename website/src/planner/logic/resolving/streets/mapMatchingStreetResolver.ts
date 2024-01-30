import { State } from '../../../store/types.ts';
import { geoCodingActions, getGeoApifyKey } from '../../../store/geoCoding.reducer.ts';
import { geoApifyFetchMapMatching, GeoApifyMapMatching } from './geoApifyMapMatching.ts';
import { getGpxSegments } from '../../../store/gpxSegments.reducer.ts';
import { SimpleGPX } from '../../../../utils/SimpleGPX.ts';
import { Point } from 'gpxparser';
import { splitListIntoSections } from '../helper/splitPointsService.ts';
import { AppDispatch } from '../../../store/store.ts';
import { geoCodingRequestsActions } from '../../../store/geoCodingRequests.reducer.ts';

function toGeoApifyMapMatchingBody(points: Point[]): GeoApifyMapMatching {
    return {
        mode: 'drive',
        waypoints: points.map((point) => ({
            timestamp: point.time?.toISOString(),
            location: [point.lon, point.lat],
        })),
    };
}

export function resolveStreetNames(getState: () => State, dispatch: AppDispatch) {
    const geoApifyKey = getGeoApifyKey(getState()) || '9785fab54f7e463fa8f04543b4b9852b';
    let counter = 0;
    dispatch(geoCodingRequestsActions.setIsLoadingData(true));
    dispatch(geoCodingRequestsActions.resetRequestDoneCounter());

    const gpxSegments = getGpxSegments(getState());
    gpxSegments.forEach((segment) => {
        SimpleGPX.fromString(segment.content).tracks.forEach((track) => {
            splitListIntoSections(track.points, 1000).forEach((points) => {
                dispatch(geoCodingRequestsActions.increaseActiveRequestCounter());
                setTimeout(() => {
                    geoApifyFetchMapMatching(geoApifyKey)(toGeoApifyMapMatchingBody(points)).then(
                        (resolvedPositions) => {
                            dispatch(geoCodingActions.saveResolvedPositions(resolvedPositions));
                            dispatch(geoCodingRequestsActions.decreaseActiveRequestCounter());
                            dispatch(geoCodingRequestsActions.increaseRequestDoneCounter());
                        }
                    );
                }, 5000 * counter);
                counter += 1;
            });
        });
    });
    return counter;
}
