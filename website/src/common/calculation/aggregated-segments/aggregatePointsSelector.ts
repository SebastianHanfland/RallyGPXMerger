import { AggregatedPoints } from '../../../planner/logic/resolving/types.ts';
import { ParsedPoint } from '../../../planner/store/types.ts';
import { calculateDistanceInKm } from './calculateDistanceInKm.ts';
import { isSameStreetName } from '../../../planner/logic/resolving/streets/isSameStreetName.ts';
import { createSelector } from '@reduxjs/toolkit';
import { getParsedGpxSegments } from '../../../planner/store/segmentData.redux.ts';
import { getStreetLookup } from '../../../planner/store/segmentData.redux.ts';
import { getStreetLookupIndex } from '../../../planner/logic/resolving/helper/getStreetLookupIndex.ts';

export function getConnectedPointWithTheSameStreetIndex(
    enrichedPoints: ParsedPoint[],
    firstPoint: ParsedPoint,
    streetLookup: Record<number, string | undefined>
): ParsedPoint[] {
    return enrichedPoints.filter((point, index) => {
        if (getStreetLookupIndex(point) === getStreetLookupIndex(firstPoint)) {
            return true;
        }
        if (index > 0) {
            const previousStreet = streetLookup[getStreetLookupIndex(enrichedPoints[index - 1])];
            const wantedStreet = streetLookup[getStreetLookupIndex(firstPoint)];
            const currentStreet = streetLookup[getStreetLookupIndex(enrichedPoints[index])];
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
                const previousStreet = streetLookup[getStreetLookupIndex(previousPoint)];
                const wantedStreet = streetLookup[getStreetLookupIndex(firstPoint)];
                searchIndex = searchIndex - 1;
                if (previousStreet && wantedStreet && !isSameStreetName(previousStreet, wantedStreet)) {
                    return false;
                }
                if (getStreetLookupIndex(previousPoint) === getStreetLookupIndex(firstPoint)) {
                    return true;
                }
            }
            return false;
        }
    });
}

export const getAggregateStreetsInSegments = createSelector(
    [getParsedGpxSegments, getStreetLookup],
    (segments, streetLookup): Record<string, AggregatedPoints[] | undefined> => {
        const aggregatedPointsForSegments: Record<string, AggregatedPoints[]> = {};
        segments.forEach((segment) => {
            aggregatedPointsForSegments[segment.id] = aggregateStreetPointsInSegment(segment.points, streetLookup);
        });
        return aggregatedPointsForSegments;
    }
);

export function aggregateStreetPointsInSegment(
    points: ParsedPoint[],
    streetLookup: Record<number, string | undefined>
): AggregatedPoints[] {
    let pointIndex = 0;
    const aggregatedPoints: AggregatedPoints[] = [];
    const initialOffset = points.length > 0 ? points[0].t : 0;

    while (pointIndex < points.length) {
        const firstPoint = points[pointIndex]!;
        const pointsWithSameStreet = getConnectedPointWithTheSameStreetIndex(points, firstPoint, streetLookup);
        const lastPoint = pointsWithSameStreet[pointsWithSameStreet.length - 1]!;
        const correctedFirstPoint = pointIndex > 0 ? points[pointIndex - 1]! : firstPoint;
        const path = pointIndex > 0 ? [correctedFirstPoint, ...pointsWithSameStreet] : pointsWithSameStreet;
        const distanceInKm = calculateDistanceInKm(path);

        aggregatedPoints.push({
            frontPassage: lastPoint.t - initialOffset,
            frontArrival: correctedFirstPoint.t - initialOffset,
            pointFrom: correctedFirstPoint,
            pointTo: lastPoint,
            path,
            distanceInKm,
            speed: (distanceInKm / (lastPoint.t - correctedFirstPoint.t)) * 3600,
            s: getStreetLookupIndex(firstPoint),
        });
        pointIndex += pointsWithSameStreet.length;
    }
    return aggregatedPoints;
}
