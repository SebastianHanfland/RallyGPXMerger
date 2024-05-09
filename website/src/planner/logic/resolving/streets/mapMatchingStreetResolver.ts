import { State } from '../../../store/types.ts';
import { geoCodingActions, getGeoApifyKey } from '../../../store/geoCoding.reducer.ts';
import { geoApifyFetchMapMatching, GeoApifyMapMatching } from './geoApifyMapMatching.ts';
import { getGpxSegments, gpxSegmentsActions } from '../../../store/gpxSegments.reducer.ts';
import { Point } from 'gpxparser';
import { splitListIntoSections } from '../helper/splitPointsService.ts';
import { AppDispatch } from '../../../store/store.ts';
import { geoCodingRequestsActions } from '../../../store/geoCodingRequests.reducer.ts';
import { getGpx } from '../../../../common/cache/gpxCache.ts';

function toGeoApifyMapMatchingBody(points: Point[]): GeoApifyMapMatching {
    return {
        mode: 'drive',
        waypoints: points.map((point) => ({
            timestamp: point.time?.toISOString(),
            location: [point.lon, point.lat],
        })),
    };
}

export async function resolveStreetNames(dispatch: AppDispatch, getState: () => State) {
    const geoApifyKey = getGeoApifyKey(getState()) || '9785fab54f7e463fa8f04543b4b9852b';
    const gpxSegments = getGpxSegments(getState()).filter((segment) => !segment.streetsResolved);
    dispatch(geoCodingRequestsActions.setIsLoadingStreetData(true));
    const promises = gpxSegments.flatMap((segment) =>
        getGpx(segment).tracks.flatMap((track) =>
            splitListIntoSections(track.points, 1000).flatMap((points) =>
                geoApifyFetchMapMatching(geoApifyKey)(toGeoApifyMapMatchingBody(points)).then((resolvedPositions) => {
                    dispatch(geoCodingActions.saveResolvedPositions(resolvedPositions));
                    dispatch(
                        gpxSegmentsActions.setSegmentStreetsResolved({
                            id: segment.id,
                            streetsResolved: true,
                        })
                    );
                })
            )
        )
    );
    await Promise.all(promises);
    return dispatch(geoCodingRequestsActions.setIsLoadingStreetData(false));
}
