import { getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import date from 'date-and-time';
import { PARTICIPANTS_DELAY_IN_SECONDS } from '../../planner/store/trackMerge.reducer.ts';
import { CalculatedTrack } from '../types.ts';
import { getLatLng } from '../../utils/pointUtil.ts';
import { TimedPoint } from '../../planner/new-store/types.ts';

function interpolatePosition(previous: TimedPoint, next: TimedPoint, timeStamp: string) {
    const nextTime = next.t;
    const previousTime = previous.t;
    const timeRange = getTimeDifferenceInSeconds(previousTime, nextTime);
    const timePart = getTimeDifferenceInSeconds(previousTime, timeStamp);
    const percentage = timePart / timeRange;

    const interpolatedLat = previous.b + percentage * (next.b - previous.b);
    const interpolatedLng = previous.l + percentage * (next.l - previous.l);

    return { lat: interpolatedLat, lng: interpolatedLng };
}

export function extractSnakeTrackFromCalculatedTrack(
    timeStampFront: string,
    participants: number,
    track: CalculatedTrack
): { lat: number; lng: number }[] {
    const timeStampEnd = date
        .addSeconds(new Date(timeStampFront), -participants * PARTICIPANTS_DELAY_IN_SECONDS)
        .toISOString();

    let returnPoints: { lat: number; lng: number }[] = [];
    const points = track.points;

    // Early returns for edge cases of time before or after the track
    if (timeStampFront < points[0].t) {
        return [getLatLng(points[0])];
    }

    const lastPoint = points[points.length - 1];
    if (timeStampEnd > lastPoint.t) {
        return [getLatLng(lastPoint)];
    }

    points.forEach((point, index) => {
        if (index === 0) {
            if (timeStampEnd < point.t) {
                returnPoints.push(getLatLng(point));
            }
            return;
        }
        const next = point.t;
        const previous = points[index - 1].t;

        if (previous < timeStampEnd && timeStampEnd < next) {
            returnPoints.push(interpolatePosition(points[index - 1], point, timeStampEnd));
        }
        if (previous < timeStampFront && timeStampFront < next) {
            returnPoints.push(interpolatePosition(points[index - 1], point, timeStampFront));
        }
        if (timeStampEnd < next && next < timeStampFront) {
            returnPoints.push(getLatLng(point));
        }
    });
    return returnPoints;
}
