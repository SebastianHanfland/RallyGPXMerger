import { AggregatedPoints } from '../../../planner/logic/resolving/types.ts';
import { ParsedPoint } from '../../../planner/store/types.ts';
import { calculateDistanceInKm } from './calculateDistanceInKm.ts';
import { isSameStreetName } from '../../../planner/logic/resolving/streets/isSameStreetName.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getParsedGpxSegments } from '../../../planner/store/segmentData.redux.ts';
import { getCorrectStreetLookup } from '../../../planner/logic/resolving/selectors/getLookups.ts';

export function getConnectedPointWithTheSameStreetIndex(
    enrichedPoints: ParsedPoint[],
    firstPoint: ParsedPoint,
    streetLookup: Record<number, string | undefined>
): ParsedPoint[] {
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

export const getAggregateStreetsInSegments = createSelector(
    [getParsedGpxSegments, getCorrectStreetLookup],
    (segments, streetLookup): Record<string, AggregatedPoints[]> => {
        const aggregatedPointsForSegments: Record<string, AggregatedPoints[]> = {};
        segments.forEach((segment) => {
            let pointIndex = 0;
            const aggregatedPoints: AggregatedPoints[] = [];

            while (pointIndex < segment.points.length) {
                const firstPoint = segment.points[pointIndex];
                const pointsWithSameStreet = getConnectedPointWithTheSameStreetIndex(
                    segment.points,
                    firstPoint,
                    streetLookup
                );
                const lastPoint = pointsWithSameStreet[pointsWithSameStreet.length - 1];

                const distanceInKm =
                    pointIndex > 0
                        ? calculateDistanceInKm([segment.points[pointIndex - 1], ...pointsWithSameStreet])
                        : calculateDistanceInKm(pointsWithSameStreet);

                const correctedFirstPoint = pointIndex > 0 ? segment.points[pointIndex - 1] : firstPoint;

                aggregatedPoints.push({
                    frontPassage: lastPoint.t,
                    frontArrival: correctedFirstPoint.t,
                    pointFrom: correctedFirstPoint,
                    pointTo: lastPoint,
                    distanceInKm: distanceInKm,
                    speed: (distanceInKm / (lastPoint.t - correctedFirstPoint.t)) * 3600,
                    s: firstPoint.s,
                });
                pointIndex += pointsWithSameStreet.length;
            }
            aggregatedPointsForSegments[segment.id] = aggregatedPoints;
        });
        return aggregatedPointsForSegments;
    }
);
