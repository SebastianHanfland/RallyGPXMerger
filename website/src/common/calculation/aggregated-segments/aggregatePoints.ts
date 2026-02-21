import date from 'date-and-time';
import { AggregatedPoints, TrackWayPointType } from '../../../planner/logic/resolving/types.ts';
import { getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';

import { TimedPoint } from '../../../planner/store/types.ts';
import { calculateDistanceInKm } from './calculateDistanceInKm.ts';
import { isSameStreetName } from '../../../planner/logic/resolving/streets/isSameStreetName.ts';

const extractLatLon = ({ b, l, t }: TimedPoint) => ({ lat: b, lon: l, time: t });

export function shiftEndTimeByParticipants(
    endDateTime: string,
    participants: number,
    participantsDelayInSeconds: number
): string {
    return date.addSeconds(new Date(endDateTime), participants * participantsDelayInSeconds).toISOString();
}

export function getConnectedPointWithTheSameStreetIndex(
    enrichedPoints: TimedPoint[],
    firstPoint: TimedPoint,
    streetLookup: Record<number, string | null>
): TimedPoint[] {
    return enrichedPoints.filter((point, index) => {
        if (point.s === firstPoint.s) {
            return true;
        }
        if (index > 0) {
            const previousStreet = streetLookup[enrichedPoints[index - 1].s];
            const wantedStreet = streetLookup[firstPoint.s];
            const currentStreet = streetLookup[enrichedPoints[index].s];
            if (
                (previousStreet && wantedStreet && !isSameStreetName(previousStreet, wantedStreet)) ||
                currentStreet !== wantedStreet
            ) {
                return false;
            }

            // find connection
            let searchIndex = index;

            while (searchIndex > 0) {
                const previousPoint = enrichedPoints[searchIndex - 1];
                const previousStreet = streetLookup[previousPoint.s];
                const wantedStreet = streetLookup[firstPoint.s];
                searchIndex = searchIndex - 1;
                if (previousStreet && wantedStreet && !isSameStreetName(previousStreet, wantedStreet)) {
                    return false;
                }
                if (previousPoint.s === firstPoint.s) {
                    return true;
                }
            }
            return false;
        }
    });
}

export function aggregatePoints(
    enrichedPoints: TimedPoint[],
    participants: number,
    participantsDelayInSeconds: number,
    streetLookup: Record<number, string | null>,
    districtLookup: Record<number, string | null>,
    postCodeLookup: Record<number, string | null>
): AggregatedPoints[] {
    let pointIndex = 0;
    const aggregatedPoints: AggregatedPoints[] = [];

    while (pointIndex < enrichedPoints.length) {
        const firstPoint = enrichedPoints[pointIndex];
        const pointsWithSameStreet = getConnectedPointWithTheSameStreetIndex(enrichedPoints, firstPoint, streetLookup);
        const lastPoint = pointsWithSameStreet[pointsWithSameStreet.length - 1];

        const distanceInKm =
            pointIndex > 0
                ? calculateDistanceInKm([enrichedPoints[pointIndex - 1], ...pointsWithSameStreet])
                : calculateDistanceInKm(pointsWithSameStreet);

        const correctedFirstPoint = pointIndex > 0 ? enrichedPoints[pointIndex - 1] : firstPoint;

        aggregatedPoints.push({
            streetName: streetLookup[firstPoint.s],
            district: districtLookup[firstPoint.s],
            postCode: postCodeLookup[firstPoint.s],
            backArrival: shiftEndTimeByParticipants(correctedFirstPoint.t, participants, participantsDelayInSeconds),
            // TODO: Check if this is right
            frontPassage: lastPoint.t,
            frontArrival: correctedFirstPoint.t,
            pointFrom: extractLatLon(correctedFirstPoint),
            pointTo: extractLatLon(lastPoint),
            distanceInKm: distanceInKm,
            speed: (distanceInKm / getTimeDifferenceInSeconds(lastPoint.t, correctedFirstPoint.t)) * 3600,
            type: TrackWayPointType.Track,
            s: firstPoint.s,
        });
        pointIndex += pointsWithSameStreet.length;
    }

    return aggregatedPoints;
}
