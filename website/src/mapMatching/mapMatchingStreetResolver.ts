import { Dispatch } from '@reduxjs/toolkit';
import { State } from '../store/types.ts';
import { getGeoApifyKey } from '../store/geoCoding.reducer.ts';
import { storage } from '../store/storage.ts';
import { geoApifyfetchMapMatching, GeoApifyMapMatching } from './geoApifyMapMatching.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { Point } from 'gpxparser';

function toGeoApifyMapMatchingBody(points: Point[]): GeoApifyMapMatching {
    return {
        mode: 'bicycle',
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
            setTimeout(() => {
                const body = toGeoApifyMapMatchingBody(track.points);
                console.log(body);
                geoApifyfetchMapMatching(geoApifyKey)(body).then((resolvedPositions) => {
                    console.log({ resolvedPositions });
                    storage.saveResolvedPositions(resolvedPositions);
                });
            }, 1000 * counter);
            counter += 1;
        });
    });
};
