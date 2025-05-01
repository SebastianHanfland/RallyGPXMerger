import { getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import date from 'date-and-time';
import { PARTICIPANTS_DELAY_IN_SECONDS } from '../../planner/store/trackMerge.reducer.ts';
import { ParsedTrack } from '../types.ts';
import { Point } from '../../utils/gpxTypes.ts';
import { toLatLng } from '../../utils/pointUtil.ts';

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

    // Early returns for edge cases of time before or after the track
    if (timeStampFront < points[0].time) {
        return [toLatLng(points[0])];
    }

    const lastPoint = points[points.length - 1];
    if (timeStampEnd > lastPoint.time) {
        return [toLatLng(lastPoint)];
    }

    points.forEach((point, index) => {
        if (index === 0) {
            if (timeStampEnd < point.time) {
                returnPoints.push(toLatLng(point));
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
            returnPoints.push(toLatLng(point));
        }
    });
    return returnPoints;
}
