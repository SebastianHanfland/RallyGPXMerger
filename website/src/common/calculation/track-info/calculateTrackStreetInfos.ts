import { AggregatedPoints, TrackStreetInfo, TrackWayPointType, WayPoint } from '../../../planner/logic/resolving/types';
import { roundPublishedStartTimes, shiftDateBySeconds } from '../../../utils/dateUtil';
import { Lookups } from '../../../planner/logic/resolving/selectors/getLookups';
import { updateExtraDelayOnTracks } from '../calculated-tracks/delayCalculation';
import {
    isTrackBreak,
    isTrackEntryPoint,
    NodeSpecifications,
    ParsedGpxSegment,
    SEGMENT,
    TrackBreak,
    TrackComposition,
    TrackEntry,
} from '../../../planner/store/types';
import { instanceOfBreak, instanceOfEntry, instanceOfNode } from '../types';
import { NodePosition } from '../../../planner/logic/resolving/selectors/getNodePositions';
import { calculateDistanceInKm } from '../aggregated-segments/calculateDistanceInKm';
import { CalculatedTrack } from '../../types';
import { joinWayPointsAtSegmentsBorders } from './joinWayPointsAtSegmentsBorders';
import { getPointsEndingAtTime } from '../lastPointUtil';
import { extractLatLon, extractPathPoint, getPreviousPoint } from './trackStreetInfoHelpers';
import { getStreetLookupIndex } from '../../../planner/logic/resolving/helper/getStreetLookupIndex';

type ResolvedTrackElement = ParsedGpxSegment | TrackBreak | TrackEntry | NodePosition;

export const calculateTrackStreetInfos = (
    segments: ParsedGpxSegment[],
    tracks: TrackComposition[],
    lookups: Lookups,
    participantsDelayInSeconds: number,
    nodes: NodePosition[],
    arrivalDateTime: string | undefined,
    calculatedTracks: CalculatedTrack[],
    nodeSpecifications: NodeSpecifications | undefined,
    aggregatedSegmentStreets: Record<string, AggregatedPoints[] | undefined>
): TrackStreetInfo[] => {
    const tracksWithEndDelay = updateExtraDelayOnTracks(tracks, participantsDelayInSeconds, nodeSpecifications);

    return tracksWithEndDelay.map((track) => {
        const calculatedTrack = calculatedTracks.find((calcTrack) => calcTrack.id === track.id);
        const distance = calculatedTrack ? calculateDistanceInKm(calculatedTrack.points) : 0;
        const wayPoints = getWayPointsOfTrack(
            track,
            segments,
            nodes,
            participantsDelayInSeconds,
            lookups,
            arrivalDateTime,
            aggregatedSegmentStreets
        );

        const fallbackDate = new Date().toISOString();
        const firstWaypoint = wayPoints[0];
        const lastWaypoint = wayPoints[wayPoints.length - 1];
        const startFront = firstWaypoint?.frontArrival ?? fallbackDate;
        const publicStart = roundPublishedStartTimes(startFront, track.buffer ?? 0, track.rounding ?? 0);

        return {
            id: track.id,
            name: track.name ?? track.id,
            startName: track.startName,
            startFront,
            publicStart,
            arrivalBack: lastWaypoint?.backPassage ?? fallbackDate,
            arrivalFront: lastWaypoint?.frontPassage ?? fallbackDate,
            distanceInKm: distance,
            peopleCount: track.peopleCount,
            wayPoints,
        };
    });
};

export function getWayPointsOfTrack(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[],
    nodes: NodePosition[],
    participantsDelayInSeconds: number,
    lookups: Lookups,
    arrivalDateTime: string | undefined,
    aggregatedSegmentStreets: Record<string, AggregatedPoints[] | undefined>
): WayPoint[] {
    let previousSegmentStartTime = -(track.delayAtEndInSeconds ?? 0);
    let trackPoints: WayPoint[] = [];
    const arrivalDate = arrivalDateTime ?? '2025-06-01T10:11:55';
    const participantDelay = participantsDelayInSeconds * (track.peopleCount ?? 0);

    const elementsInReverseOrder = resolveGpxSegments(track, gpxSegments, nodes).reverse();

    elementsInReverseOrder.forEach((element) => {
        const previousPoint = getPreviousPoint(trackPoints, arrivalDate);

        if (instanceOfBreak(element)) {
            previousSegmentStartTime -= element.minutes * 60;
            const breakWaypoint = createBreakWaypoint(element, previousPoint, participantDelay);
            trackPoints = [breakWaypoint, ...trackPoints];
        } else if (instanceOfEntry(element)) {
            const entryWaypoint = createEntryWaypoint(element, previousPoint, participantDelay);
            trackPoints = [entryWaypoint, ...trackPoints];
        } else if (instanceOfNode(element)) {
            const nodeWaypoint = createNodeWaypoint(element, previousPoint, participantDelay);
            trackPoints = [nodeWaypoint, ...trackPoints];
        } else {
            const shiftedPoints = getPointsEndingAtTime(element, previousSegmentStartTime);
            if (shiftedPoints.length > 0) {
                previousSegmentStartTime = shiftedPoints[0].t;
                const segmentWaypoints = createSegmentWaypoints(
                    aggregatedSegmentStreets[element.id],
                    arrivalDate,
                    lookups,
                    previousSegmentStartTime,
                    participantDelay
                );
                trackPoints = joinWayPointsAtSegmentsBorders(segmentWaypoints, trackPoints);
            }
        }
    });

    return replaceFallbackBreakPositions(trackPoints);
}

function replaceFallbackBreakPositions(trackPoints: WayPoint[]): WayPoint[] {
    const lastTrackPoint = [...trackPoints].reverse().find((point) => point.type === TrackWayPointType.Track);
    if (!lastTrackPoint) {
        return trackPoints;
    }

    return trackPoints.map((point) => {
        if (point.type !== TrackWayPointType.Break || point.pointFrom.lat !== 0 || point.pointFrom.lon !== 0) {
            return point;
        }

        return {
            ...point,
            pointFrom: lastTrackPoint.pointTo,
            pointTo: lastTrackPoint.pointTo,
        };
    });
}

function createBreakWaypoint(breakElement: TrackBreak, previousPoint: WayPoint, participantDelay: number): WayPoint {
    return {
        streetName: breakElement.streetName ?? previousPoint.streetName,
        breakLength: breakElement.minutes,
        type: TrackWayPointType.Break,
        pointTo: previousPoint.pointFrom,
        pointFrom: previousPoint.pointFrom,
        frontArrival: shiftDateBySeconds(previousPoint.frontArrival, -breakElement.minutes * 60),
        backPassage: shiftDateBySeconds(previousPoint.frontArrival, participantDelay),
        frontPassage: previousPoint.frontArrival,
        speed: undefined,
        postCode: '',
        distanceInKm: undefined,
        district: '',
        breakId: breakElement.id,
    };
}

function createEntryWaypoint(entry: TrackEntry, previousPoint: WayPoint, participantDelay: number): WayPoint {
    return {
        streetName: entry.streetName,
        type: TrackWayPointType.Entry,
        pointTo: previousPoint.pointFrom,
        pointFrom: previousPoint.pointFrom,
        frontArrival: roundPublishedStartTimes(previousPoint.frontArrival, entry.buffer ?? 0, entry.rounding ?? 0),
        backPassage: shiftDateBySeconds(previousPoint.frontArrival, participantDelay),
        frontPassage: previousPoint.frontArrival,
        speed: undefined,
        postCode: '',
        distanceInKm: undefined,
        district: '',
        entryId: entry.id,
    };
}

function createNodeWaypoint(node: NodePosition, previousPoint: WayPoint, participantDelay: number): WayPoint {
    return {
        ...previousPoint,
        streetName: node.streetName ?? previousPoint.streetName,
        type: TrackWayPointType.Node,
        nodeTracks: node.tracks,
        pointTo: previousPoint.pointFrom,
        pointFrom: previousPoint.pointFrom,
        frontArrival: previousPoint.frontArrival,
        frontPassage: previousPoint.frontArrival,
        backPassage: shiftDateBySeconds(previousPoint.frontArrival, participantDelay),
        speed: undefined,
        postCode: '',
        distanceInKm: undefined,
        district: '',
        segmentAfterId: node.segmentIdAfter,
    };
}

function createSegmentWaypoints(
    aggregatedPoints: AggregatedPoints[] | undefined,
    arrivalDate: string,
    lookups: Lookups,
    segmentStartTime: number,
    participantDelay: number
): WayPoint[] {
    return (aggregatedPoints ?? []).map((point) => {
        const streetLookupIndex = getStreetLookupIndex(point);
        return {
            streetName: lookups.streets[streetLookupIndex] ?? null,
            district: lookups.districts[streetLookupIndex] ?? null,
            postCode: lookups.postCodes[streetLookupIndex] ?? null,
            backPassage: shiftDateBySeconds(arrivalDate, point.frontPassage + participantDelay + segmentStartTime),
            frontPassage: shiftDateBySeconds(arrivalDate, point.frontPassage + segmentStartTime),
            frontArrival: shiftDateBySeconds(arrivalDate, point.frontArrival + segmentStartTime),
            pointFrom: extractLatLon(point.pointFrom, arrivalDate),
            pointTo: extractLatLon(point.pointTo, arrivalDate),
            path: point.path.map(extractPathPoint),
            distanceInKm: point.distanceInKm,
            speed: point.speed,
            type: TrackWayPointType.Track,
            s: getStreetLookupIndex(point),
        };
    });
}

export function resolveGpxSegments(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[],
    nodes: NodePosition[]
): (ParsedGpxSegment | TrackBreak | TrackEntry | NodePosition)[] {
    const trackElements: ResolvedTrackElement[] = [];
    track.segments.forEach((trackElement) => {
        if (isTrackBreak(trackElement)) {
            trackElements.push(trackElement);
            return;
        }
        if (isTrackEntryPoint(trackElement)) {
            trackElements.push(trackElement);
            return;
        }
        const nodeBeforeSegment = nodes.find(
            (node) => node.segmentIdAfter === trackElement.id && trackElement.type === SEGMENT
        );
        if (nodeBeforeSegment) {
            trackElements.push(nodeBeforeSegment);
        }
        const gpxSegment = gpxSegments.find((segment) => segment.id === trackElement.id);
        if (gpxSegment) {
            trackElements.push(gpxSegment);
        }
    });
    return trackElements;
}
