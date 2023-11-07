import { State } from '../store/types.ts';
import { geoCodingActions, getGeoApifyKey } from '../store/geoCoding.reducer.ts';
import { geoApifyFetchMapMatching, GeoApifyMapMatching } from './geoApifyMapMatching.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { Point } from 'gpxparser';
import { splitListIntoSections } from './splitPointsService.ts';
import { calculateTrackStreetInfos } from './calculateTrackStreetInfos.ts';
import { AppDispatch } from '../store/store.ts';

function toGeoApifyMapMatchingBody(points: Point[]): GeoApifyMapMatching {
    return {
        mode: 'drive',
        waypoints: points.map((point) => ({
            timestamp: point.time?.toISOString(),
            location: [point.lon, point.lat],
        })),
    };
}

export const resolvePositions = (dispatch: AppDispatch, getState: () => State) => {
    const geoApifyKey = getGeoApifyKey(getState());
    if (!geoApifyKey) {
        return;
    }
    let counter = 0;
    dispatch(geoCodingActions.resetRequestDoneCounter());

    const gpxSegments = getGpxSegments(getState());
    gpxSegments.forEach((segment) => {
        const gpx = SimpleGPX.fromString(segment.content);
        gpx.tracks.forEach((track) => {
            const listOfPoints = splitListIntoSections(track.points, 1000);
            listOfPoints.forEach((points) => {
                dispatch(geoCodingActions.increaseActiveRequestCounter());
                setTimeout(() => {
                    const body = toGeoApifyMapMatchingBody(points);
                    geoApifyFetchMapMatching(geoApifyKey)(body).then((resolvedPositions) => {
                        dispatch(geoCodingActions.saveResolvedPositions(resolvedPositions));
                        dispatch(geoCodingActions.decreaseActiveRequestCounter());
                        dispatch(geoCodingActions.increaseRequestDoneCounter());
                    });
                }, 5000 * counter);
                counter += 1;
            });
        });
    });
    dispatch(calculateTrackStreetInfos);
};
