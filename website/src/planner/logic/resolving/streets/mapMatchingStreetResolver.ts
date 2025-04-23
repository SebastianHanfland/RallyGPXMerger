import { State } from '../../../store/types.ts';
import { geoCodingActions, getGeoApifyKey } from '../../../store/geoCoding.reducer.ts';
import { geoApifyFetchMapMatching, GeoApifyMapMatching } from './geoApifyMapMatching.ts';
import { getGpxSegments, gpxSegmentsActions } from '../../../store/gpxSegments.reducer.ts';
import { SimpleGPX } from '../../../../utils/SimpleGPX.ts';
import { splitListIntoSections } from '../helper/splitPointsService.ts';
import { AppDispatch } from '../../../store/store.ts';
import { geoCodingRequestsActions } from '../../../store/geoCodingRequests.reducer.ts';
import { errorNotification } from '../../../store/toast.reducer.ts';
import { triggerAutomaticCalculation } from '../../automaticCalculation.ts';
import { Point } from '../../../../utils/gpxTypes.ts';

function toGeoApifyMapMatchingBody(points: Point[]): GeoApifyMapMatching {
    return {
        mode: 'drive',
        waypoints: points.map((point) => ({
            timestamp: point.time,
            location: [point.lon, point.lat],
        })),
    };
}

export async function resolveStreetNames(dispatch: AppDispatch, getState: () => State) {
    const geoApifyKey = getGeoApifyKey(getState()) || '9785fab54f7e463fa8f04543b4b9852b';
    const gpxSegments = getGpxSegments(getState()).filter((segment) => !segment.streetsResolved);
    dispatch(geoCodingRequestsActions.setIsLoadingStreetData(true));
    let apiError = false;
    const promises = gpxSegments.flatMap((segment) =>
        SimpleGPX.fromString(segment.content).tracks.flatMap((track) =>
            splitListIntoSections(track.points, 1000).flatMap((points) =>
                geoApifyFetchMapMatching(geoApifyKey)(toGeoApifyMapMatchingBody(points)).then((resolvedPositions) => {
                    if (Object.keys(resolvedPositions).length === 0) {
                        apiError = true;
                    }
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
    if (apiError) {
        errorNotification(
            dispatch,
            'GeoApify Quota exceeded',
            'Please read the FAQ and create an own free account at geoapify and enter the API Key under Settings'
        );
    }
    dispatch(triggerAutomaticCalculation);
    return dispatch(geoCodingRequestsActions.setIsLoadingStreetData(false));
}
