import { Point } from 'gpxparser';
import date from 'date-and-time';
import { PARTICIPANTS_DELAY_IN_SECONDS } from '../../../store/trackMerge.reducer.ts';
import { TrackWayPointType } from '../types.ts';
import geoDistance from 'geo-distance-helper';
import { getTimeDifferenceInSeconds } from '../../../../utils/dateUtil.ts';
import { NodePosition } from '../selectors/getNodePositions.ts';
import { toLatLng } from '../../../../utils/pointUtil.ts';

export interface EnrichedPoints extends PointS {
    street: string | null;
}

export interface PointS extends Omit<Point, 'time'> {
    time: string;
}

interface AggregatedPoints {
    streetName: string | null;
    frontArrival: string;
    frontPassage: string;
    backArrival: string;
    pointFrom: { lat: number; lon: number; time: string };
    pointTo: { lat: number; lon: number; time: string };
    speed?: number;
    distanceInKm?: number;
    type?: TrackWayPointType;
    breakLength?: number;
    nodeTracks?: string[];
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

const extractLatLon = ({ lat, lon, time }: EnrichedPoints) => ({ lat, lon, time });

function shiftEndTimeByParticipants(endDateTime: string, participants: number): string {
    return date.addSeconds(new Date(endDateTime), participants * PARTICIPANTS_DELAY_IN_SECONDS).toISOString();
}

function useLastKnownStreet(lastElement: AggregatedPoints, point: EnrichedPoints, participants: number) {
    return {
        ...lastElement,
        backArrival: shiftEndTimeByParticipants(point.time, participants),
        frontPassage: point.time,
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

const MINIMUM_SECONDS_FOR_BREAK = 200;
const MAXMIMUM_DISTANCE_IN_KM_FOR_BREAK = 0.1;

function isABreak(lastElement: AggregatedPoints, point: EnrichedPoints) {
    const distance = geoDistance(toLatLng(lastElement.pointTo), toLatLng(point)) as number;
    const timeDifference = getTimeDifferenceInSeconds(point.time, lastElement.frontPassage);
    return distance < MAXMIMUM_DISTANCE_IN_KM_FOR_BREAK && timeDifference > MINIMUM_SECONDS_FOR_BREAK;
}

function createAggregatedPoint(point: EnrichedPoints, participants: number, type: TrackWayPointType) {
    return {
        streetName: point.street,
        backArrival: shiftEndTimeByParticipants(point.time, participants),
        frontPassage: point.time,
        frontArrival: point.time,
        pointFrom: extractLatLon(point),
        pointTo: extractLatLon(point),
        type: type,
    };
}

const NumberOfPreviousPointsToInferNameOf = 4;

function streetUnknownAndAPreviousPointHasAStreet(
    point: EnrichedPoints,
    index: number,
    enrichedPoints: EnrichedPoints[]
) {
    if (point.street !== null) {
        return false;
    }
    let previousStreetKnown = false;
    for (let i = 0; i < NumberOfPreviousPointsToInferNameOf; i++) {
        if (index > i && enrichedPoints[index - (i + 1)].street !== null) {
            previousStreetKnown = true;
        }
    }
    return previousStreetKnown;
}

export function aggregateEnrichedPoints(
    enrichedPoints: EnrichedPoints[],
    participants: number,
    nodePositions: NodePosition[]
): AggregatedPoints[] {
    const aggregatedPoints: AggregatedPoints[] = [];
    enrichedPoints.forEach((point, index) => {
        if (point.street === null && index === 0) {
            return;
        }
        if (aggregatedPoints.length === 0) {
            aggregatedPoints.push(createAggregatedPoint(point, participants, TrackWayPointType.Track));
            return;
        }

        const lastIndex = aggregatedPoints.length - 1;
        const lastElement = aggregatedPoints[lastIndex];

        if (streetUnknownAndAPreviousPointHasAStreet(point, index, enrichedPoints)) {
            aggregatedPoints[lastIndex] = useLastKnownStreet(lastElement, point, participants);
            return;
        }

        const lastStreetName = lastElement.streetName;
        const streetName = point.street;

        if (isABreak(lastElement, point) && lastElement.type !== TrackWayPointType.Break) {
            aggregatedPoints.push({
                streetName: point.street,
                backArrival: shiftEndTimeByParticipants(point.time, participants),
                frontPassage: lastElement.frontArrival,
                frontArrival: lastElement.frontArrival,
                pointFrom: extractLatLon(point),
                pointTo: extractLatLon(point),
                type: TrackWayPointType.Break,
                distanceInKm: 0,
                breakLength: getTimeDifferenceInSeconds(point.time, lastElement.frontPassage) / 60,
            });
            return;
        }

        const matchingNodePosition = getMatchingNodePosition(nodePositions, point);
        if (matchingNodePosition) {
            const nodePoints = aggregatedPoints.filter((aggPoint) => aggPoint.type === TrackWayPointType.Node);

            const lastNodeTracks =
                nodePoints.length > 0 ? nodePoints[nodePoints.length - 1].nodeTracks?.join('') : undefined;

            if (
                !getMatchingNodePosition(nodePositions, lastElement.pointTo) &&
                lastNodeTracks !== matchingNodePosition.tracks?.join('')
            ) {
                aggregatedPoints.push({
                    ...createAggregatedPoint(point, participants, TrackWayPointType.Node),
                    nodeTracks: matchingNodePosition.tracks,
                });
            }
            return;
        }

        if (anyStreetNameMatch(streetName, lastStreetName) && lastElement.type === TrackWayPointType.Track) {
            const detailedStreetName = takeMostDetailedStreetName(streetName, lastStreetName);
            const newDistance =
                (lastElement.distanceInKm ?? 0) +
                (geoDistance(toLatLng(point), toLatLng(lastElement.pointTo)) as number);
            aggregatedPoints[lastIndex] = {
                ...lastElement,
                streetName: detailedStreetName,
                backArrival: shiftEndTimeByParticipants(point.time, participants),
                frontPassage: point.time,
                pointTo: extractLatLon(point),
                distanceInKm: newDistance,
                speed:
                    newDistance > 0
                        ? (newDistance / getTimeDifferenceInSeconds(point.time, lastElement.pointFrom.time)) * 3600
                        : undefined,
                type: TrackWayPointType.Track,
            };
        } else {
            aggregatedPoints[lastIndex] = {
                ...lastElement,
                backArrival: shiftEndTimeByParticipants(point.time, participants),
                frontPassage: point.time,
                pointTo: extractLatLon(point),
            };
            aggregatedPoints.push(createAggregatedPoint(point, participants, TrackWayPointType.Track));
        }
    });
    return aggregatedPoints;
}
