import { getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import date from 'date-and-time';
import { PARTICIPANTS_DELAY_IN_SECONDS } from '../../planner/store/trackMerge.reducer.ts';
import { ParsedTrack, ReadableTrack } from '../types.ts';
import { Point, Track } from '../../utils/gpxTypes.ts';

function interpolatePosition(previous: Point, next: Point, timeStamp: string) {
    const nextTime = next.time;
    const previousTime = previous.time;
    const timeRange = getTimeDifferenceInSeconds(previousTime, nextTime);
    const timePart = getTimeDifferenceInSeconds(previousTime, timeStamp);
    const percentage = timePart / timeRange;

    const interpolatedLat = previous.lat + percentage * (next.lat - previous.lat);
    const interpolatedLng = previous.lon + percentage * (next.lon - previous.lon);

    return { lat: interpolatedLat, lng: interpolatedLng };
}

export function extractSnakeTrack(
    timeStampFront: string,
    participants: number,
    readableTrack: ReadableTrack
): { lat: number; lng: number }[] {
    const timeStampEnd = date
        .addSeconds(new Date(timeStampFront), -participants * PARTICIPANTS_DELAY_IN_SECONDS)
        .toISOString();

    let returnPoints: { lat: number; lng: number }[] = [];
    let lastTrack: Track | null = null;
    readableTrack.gpx.tracks.forEach((track) => {
        if (lastTrack !== null) {
            const lastPointOfLastTrack = lastTrack.points[lastTrack.points.length - 1];
            const firstPointNextTrack = track.points[0];
            if (timeStampFront > lastPointOfLastTrack.time && timeStampFront < firstPointNextTrack.time) {
                returnPoints.push({ lat: lastPointOfLastTrack.lat, lng: lastPointOfLastTrack.lon });
            }
        }
        track.points.forEach((point, index, points) => {
            if (index === 0) {
                if (lastTrack === null && timeStampEnd < point.time) {
                    returnPoints.push({ lat: point.lat, lng: point.lon });
                }
                return;
            }
            const next = point.time;
            const previous = points[index - 1].time;

            if (previous < timeStampEnd && timeStampEnd < next) {
                returnPoints.push(interpolatePosition(points[index - 1], point, timeStampEnd));
            }
            if (previous < timeStampFront && timeStampFront < next) {
                returnPoints.push(interpolatePosition(points[index - 1], point, timeStampFront));
            }
            if (timeStampEnd < next && next < timeStampFront) {
                returnPoints.push({ lat: point.lat, lng: point.lon });
            }
        });
        lastTrack = track;
    });
    return returnPoints;
}

export function extractSnakeTrackFromParsedTrack(
    timeStampFront: string,
    participants: number,
    track: ParsedTrack
): { lat: number; lng: number }[] {
    const timeStampEnd = date
        .addSeconds(new Date(timeStampFront), -participants * PARTICIPANTS_DELAY_IN_SECONDS)
        .toISOString();

    let returnPoints: { lat: number; lng: number }[] = [];

    const points = track.points;
    points.forEach((point, index) => {
        if (index === 0) {
            if (timeStampEnd < point.time) {
                returnPoints.push({ lat: point.lat, lng: point.lon });
            }
            return;
        }
        const next = point.time;
        const previous = points[index - 1].time;

        if (previous < timeStampEnd && timeStampEnd < next) {
            returnPoints.push(interpolatePosition(points[index - 1], point, timeStampEnd));
        }
        if (previous < timeStampFront && timeStampFront < next) {
            returnPoints.push(interpolatePosition(points[index - 1], point, timeStampFront));
        }
        if (timeStampEnd < next && next < timeStampFront) {
            returnPoints.push({ lat: point.lat, lng: point.lon });
        }
    });
    return returnPoints;
}
