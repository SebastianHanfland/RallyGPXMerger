import date from 'date-and-time';
import { PARTICIPANTS_DELAY_IN_SECONDS } from '../../../store/trackMerge.reducer.ts';
import { AggregatedPoints, TrackWayPointType } from '../types.ts';
import { getTimeDifferenceInSeconds } from '../../../../utils/dateUtil.ts';

import { TimedPoint } from '../../../store/types.ts';
import { calculateDistanceInKm } from './calculateDistanceInKm.ts';

const extractLatLon = ({ b, l, t }: TimedPoint) => ({ lat: b, lon: l, time: t });

function shiftEndTimeByParticipants(endDateTime: string, participants: number): string {
    return date.addSeconds(new Date(endDateTime), participants * PARTICIPANTS_DELAY_IN_SECONDS).toISOString();
}

function getConnectedPointWithTheSameStreetIndex(enrichedPoints: TimedPoint[], firstPoint: TimedPoint) {
    return enrichedPoints.filter((point) => point.s === firstPoint.s);
}

export function aggregatePoints(
    enrichedPoints: TimedPoint[],
    participants: number,
    streetLookup: Record<number, string | null>,
    districtLookup: Record<number, string | null>,
    postCodeLookup: Record<number, string | null>
): AggregatedPoints[] {
    let pointIndex = 0;
    const aggregatedPoints: AggregatedPoints[] = [];

    while (pointIndex < enrichedPoints.length) {
        const firstPoint = enrichedPoints[pointIndex];
        const pointsWithSameStreet = getConnectedPointWithTheSameStreetIndex(enrichedPoints, firstPoint);
        const lastPoint = pointsWithSameStreet[pointsWithSameStreet.length - 1];

        const distanceInKm = calculateDistanceInKm(pointsWithSameStreet);
        aggregatedPoints.push({
            streetName: streetLookup[firstPoint.s],
            district: districtLookup[firstPoint.s],
            postCode: postCodeLookup[firstPoint.s],
            backArrival: shiftEndTimeByParticipants(firstPoint.t, participants),
            // TODO: Check if this is right
            frontPassage: lastPoint.t,
            frontArrival: firstPoint.t,
            pointFrom: extractLatLon(firstPoint),
            pointTo: extractLatLon(lastPoint),
            distanceInKm: distanceInKm,
            speed: (distanceInKm / getTimeDifferenceInSeconds(lastPoint.t, firstPoint.t)) * 3600,
            type: TrackWayPointType.Track,
        });
        pointIndex += pointsWithSameStreet.length;
    }

    return aggregatedPoints;
}
