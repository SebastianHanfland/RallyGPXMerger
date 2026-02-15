import date from 'date-and-time';
import { PARTICIPANTS_DELAY_IN_SECONDS } from '../../../store/trackMerge.reducer.ts';
import { AggregatedPoints, TrackWayPointType } from '../types.ts';
import geoDistance from 'geo-distance-helper';
import { getTimeDifferenceInSeconds } from '../../../../utils/dateUtil.ts';
import { NodePosition } from '../selectors/getNodePositions.ts';
import { getLatLng, getLatLon, toLatLng } from '../../../../utils/pointUtil.ts';
import { Point } from '../../../../utils/gpxTypes.ts';

import { TimedPoint } from '../../../store/types.ts';

export interface EnrichedPoints extends PointS {
    street: string | null;
}

export interface PointS extends Omit<Point, 'time'> {
    time: string;
}

export function anyStreetNameMatch(streetName: string | null, lastStreetName: string | null): boolean {
    if (!streetName && !lastStreetName) {
        return true;
    }
    if (!streetName || !lastStreetName) {
        return false;
    }
    const streetNameElements = streetName.split(', ');
    return lastStreetName.startsWith(streetNameElements[0]);
}

export function takeMostDetailedStreetName(streetName: string | null, lastStreetName: string | null): string | null {
    if (!streetName && !lastStreetName) {
        return null;
    }
    if (!streetName || !lastStreetName) {
        return lastStreetName ? lastStreetName : streetName;
    }
    if (!anyStreetNameMatch(streetName, lastStreetName)) {
        return streetName;
    }
    const streetNameElements = streetName.split(', ');
    const lastStreetNameElements = lastStreetName.split(', ');
    return [...new Set([...lastStreetNameElements, ...streetNameElements])].join(', ');
}

const extractLatLon = ({ b, l, t }: TimedPoint) => ({ lat: b, lon: l, time: t });

function shiftEndTimeByParticipants(endDateTime: string, participants: number): string {
    return date.addSeconds(new Date(endDateTime), participants * PARTICIPANTS_DELAY_IN_SECONDS).toISOString();
}

function useLastKnownStreet(lastElement: AggregatedPoints, point: TimedPoint, participants: number) {
    return {
        ...lastElement,
        backArrival: shiftEndTimeByParticipants(point.t, participants),
        frontPassage: point.t,
        pointTo: extractLatLon(point),
    };
}

function getMatchingNodePosition(
    nodePositions: NodePosition[],
    point: { lat: number; lon: number }
): NodePosition | undefined {
    return nodePositions.find(
        (nodePosition) => (geoDistance(toLatLng(nodePosition.point), toLatLng(point)) as number) < 0.0000001
    );
}

const MINIMUM_SECONDS_FOR_BREAK = 59;
const MAXIMUM_DISTANCE_IN_KM_FOR_BREAK = 0.1;

function isABreak(lastElement: AggregatedPoints, point: TimedPoint) {
    const distance = geoDistance(toLatLng(lastElement.pointTo), getLatLng(point)) as number;
    const timeDifference = getTimeDifferenceInSeconds(point.t, lastElement.frontPassage);
    return distance < MAXIMUM_DISTANCE_IN_KM_FOR_BREAK && timeDifference > MINIMUM_SECONDS_FOR_BREAK;
}

function createAggregatedPoint(
    point: TimedPoint,
    participants: number,
    type: TrackWayPointType,
    streetLookup: Record<number, string | null>
) {
    return {
        streetName: streetLookup[point.s],
        backArrival: shiftEndTimeByParticipants(point.t, participants),
        frontPassage: point.t,
        frontArrival: point.t,
        pointFrom: extractLatLon(point),
        pointTo: extractLatLon(point),
        type: type,
    };
}

const NumberOfPreviousPointsToInferNameOf = 4;

function streetUnknownAndAPreviousPointHasAStreet(
    point: TimedPoint,
    index: number,
    enrichedPoints: TimedPoint[],
    streetLookup: Record<number, string | null>
) {
    if (streetLookup[point.s] !== null) {
        return false;
    }
    let previousStreetKnown = false;
    for (let i = 0; i < NumberOfPreviousPointsToInferNameOf; i++) {
        if (index > i && streetLookup[enrichedPoints[index - (i + 1)].s] !== null) {
            previousStreetKnown = true;
        }
    }
    return previousStreetKnown;
}

export function aggregateEnrichedPoints(
    enrichedPoints: TimedPoint[],
    participants: number,
    nodePositions: NodePosition[],
    streetLookup: Record<number, string | null>
): AggregatedPoints[] {
    const aggregatedPoints: AggregatedPoints[] = [];
    enrichedPoints.forEach((point, index) => {
        if (streetLookup[point.s] === null && index === 0) {
            return;
        }
        if (aggregatedPoints.length === 0) {
            aggregatedPoints.push(createAggregatedPoint(point, participants, TrackWayPointType.Track, streetLookup));
            return;
        }

        const lastIndex = aggregatedPoints.length - 1;
        const lastElement = aggregatedPoints[lastIndex];

        if (streetUnknownAndAPreviousPointHasAStreet(point, index, enrichedPoints, streetLookup)) {
            aggregatedPoints[lastIndex] = useLastKnownStreet(lastElement, point, participants);
            return;
        }

        const lastStreetName = lastElement.streetName;
        const streetName = streetLookup[point.s];

        if (isABreak(lastElement, point) && lastElement.type !== TrackWayPointType.Break) {
            aggregatedPoints.push({
                streetName: streetLookup[point.s],
                backArrival: shiftEndTimeByParticipants(point.t, participants),
                frontPassage: lastElement.frontArrival,
                frontArrival: lastElement.frontArrival,
                pointFrom: extractLatLon(point),
                pointTo: extractLatLon(point),
                type: TrackWayPointType.Break,
                distanceInKm: 0,
                breakLength: getTimeDifferenceInSeconds(point.t, lastElement.frontPassage) / 60,
            });
            return;
        }

        const matchingNodePosition = getMatchingNodePosition(nodePositions, getLatLon(point));
        if (matchingNodePosition) {
            const nodePoints = aggregatedPoints.filter((aggPoint) => aggPoint.type === TrackWayPointType.Node);

            const lastNodeTracks =
                nodePoints.length > 0 ? nodePoints[nodePoints.length - 1].nodeTracks?.join('') : undefined;

            if (
                !getMatchingNodePosition(nodePositions, lastElement.pointTo) &&
                lastNodeTracks !== matchingNodePosition.tracks?.join('')
            ) {
                aggregatedPoints.push({
                    ...createAggregatedPoint(point, participants, TrackWayPointType.Node, streetLookup),
                    nodeTracks: matchingNodePosition.tracks,
                });
            }
            return;
        }

        if (anyStreetNameMatch(streetName, lastStreetName) && lastElement.type === TrackWayPointType.Track) {
            const detailedStreetName = takeMostDetailedStreetName(streetName, lastStreetName);
            const newDistance =
                (lastElement.distanceInKm ?? 0) +
                (geoDistance(getLatLng(point), toLatLng(lastElement.pointTo)) as number);
            aggregatedPoints[lastIndex] = {
                ...lastElement,
                streetName: detailedStreetName,
                backArrival: shiftEndTimeByParticipants(point.t, participants),
                frontPassage: point.t,
                pointTo: extractLatLon(point),
                distanceInKm: newDistance,
                speed:
                    newDistance > 0
                        ? (newDistance / getTimeDifferenceInSeconds(point.t, lastElement.pointFrom.time)) * 3600
                        : undefined,
                type: TrackWayPointType.Track,
            };
        } else {
            aggregatedPoints[lastIndex] = {
                ...lastElement,
                backArrival: shiftEndTimeByParticipants(point.t, participants),
                frontPassage: point.t,
                pointTo: extractLatLon(point),
            };
            aggregatedPoints.push(createAggregatedPoint(point, participants, TrackWayPointType.Track, streetLookup));
        }
    });
    return aggregatedPoints;
}
