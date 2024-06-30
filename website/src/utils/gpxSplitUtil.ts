import { SimpleGPX } from './SimpleGPX.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from './pointUtil.ts';

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
    return [content, content];
};
