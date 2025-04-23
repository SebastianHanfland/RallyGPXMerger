import { SimpleGPX } from './SimpleGPX.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from './pointUtil.ts';
import { Track } from './gpxTypes.ts';

export const splitGpx = (content: string, splitPoint: { lat: number; lng: number }): [string, string] => {
    let pointWithMinimalDistance: { lat: number; lon: number } | undefined = undefined;
    let minimalDistance: number = 999999999;
    const simpleGPX = SimpleGPX.fromString(content);
    simpleGPX.tracks.forEach((track) => {
        track.points.forEach((point) => {
            const distance = geoDistance(toLatLng(point), splitPoint) as number;
            if (distance < minimalDistance) {
                minimalDistance = distance;
                pointWithMinimalDistance = point;
            }
        });
    });
    console.log(pointWithMinimalDistance, splitPoint, minimalDistance);

    const tracksBefore: Track[] = [];
    const tracksAfter: Track[] = [];

    let splitPointReached = false;

    simpleGPX.tracks.forEach((track) => {
        if (!splitPointReached) {
            tracksBefore.push({ ...track, points: [] });
        } else {
            tracksAfter.push({ ...track, points: [] });
        }
        track.points.forEach((point) => {
            if (point === pointWithMinimalDistance) {
                splitPointReached = true;
                tracksBefore[tracksBefore.length - 1].points.push(point);
                tracksAfter.push({ ...track, points: [] });
            }
            if (!splitPointReached) {
                tracksBefore[tracksBefore.length - 1].points.push(point);
            } else {
                tracksAfter[tracksAfter.length - 1].points.push(point);
            }
        });
    });
    const gpxBefore = simpleGPX.duplicate(tracksBefore).toString();
    const gpxAfter = simpleGPX.duplicate(tracksAfter).toString();

    return [gpxBefore, gpxAfter];
};
