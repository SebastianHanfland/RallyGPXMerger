import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import { getGeoApifyKey } from '../store/geoCoding.reducer.ts';
import { storage } from '../store/storage.ts';
import { geoApifyfetchMapMatching, GeoApifyMapMatching } from './geoApifyMapMatching.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { Point } from 'gpxparser';
import { splitListIntoSections } from './splitPointsService.ts';

function toGeoApifyMapMatchingBody(points: Point[]): GeoApifyMapMatching {
    return {
        mode: 'drive',
        waypoints: points.map((point) => ({
            timestamp: point.time?.toISOString(),
            location: [point.lon, point.lat],
        })),
    };
}

export const resolvePositions = (_: Dispatch, getState: () => State) => {
    const geoApifyKey = getGeoApifyKey(getState());
    if (!geoApifyKey) {
        return;
    }
    let counter = 0;
    const gpxSegments = getGpxSegments(getState());
    gpxSegments.forEach((segment) => {
        const gpx = SimpleGPX.fromString(segment.content);
        gpx.tracks.forEach((track) => {
            const listOfPoints = splitListIntoSections(track.points, 1000);
            listOfPoints.forEach((points) => {
                setTimeout(() => {
                    const body = toGeoApifyMapMatchingBody(points);
                    geoApifyfetchMapMatching(geoApifyKey)(body).then((resolvedPositions) => {
                        storage.saveResolvedPositions(resolvedPositions);
                    });
                }, 5000 * counter);
                counter += 1;
            });
        });
    });
};
