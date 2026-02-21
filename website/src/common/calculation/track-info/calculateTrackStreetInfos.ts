import { AggregatedPoints, TrackStreetInfo, TrackWayPointType } from '../../../planner/logic/resolving/types.ts';
import { roundPublishedStartTimes, shiftDateBySeconds } from '../../../utils/dateUtil.ts';
import { Lookups } from '../../../planner/logic/resolving/selectors/getLookups.ts';
import { updateExtraDelayOnTracks } from '../../../planner/logic/calculate/solver.ts';
import {
    BREAK,
    NodeSpecifications,
    ParsedGpxSegment,
    ParsedPoint,
    TrackComposition,
} from '../../../planner/store/types.ts';
import { Break, instanceOfBreak, instanceOfNode } from '../../../planner/logic/calculate/types.ts';
import { NodePosition } from '../../../planner/logic/resolving/selectors/getNodePositions.ts';
import { aggregatePoints } from '../../../planner/logic/resolving/aggregate/aggregatePoints.ts';
import { calculateDistanceInKm } from '../../../planner/logic/resolving/aggregate/calculateDistanceInKm.ts';
import { CalculatedTrack } from '../../types.ts';

export const calculateTrackStreetInfos = (
    segments: ParsedGpxSegment[],
    tracks: TrackComposition[],
    lookups: Lookups,
    participantsDelayInSeconds: number,
    nodes: NodePosition[],
    arrivalDateTime: string | undefined,
    calculatedTracks: CalculatedTrack[],
    nodeSpecifications: NodeSpecifications | undefined
): TrackStreetInfo[] => {
    const trackWithEndDelay = updateExtraDelayOnTracks(tracks, participantsDelayInSeconds, nodeSpecifications);

    return trackWithEndDelay.map((track) => {
        const calculatedTrack = calculatedTracks.find((calcTrack) => calcTrack.id === track.id);
        const distance = calculatedTrack ? calculateDistanceInKm(calculatedTrack.points) : 0;

        const wayPoints = getWayPointsOfTrack(
            track,
            segments,
            nodes,
            participantsDelayInSeconds,
            lookups,
            arrivalDateTime
        );

        const backupDate = new Date().toISOString();
        const startFront = wayPoints.length > 0 ? wayPoints[0].frontArrival : backupDate;
        const publicStart = track
            ? roundPublishedStartTimes(startFront, track.buffer ?? 0, track.rounding ?? 0)
            : startFront;

        return {
            id: track.id,
            name: track.name ?? track.id,
            startFront: startFront,
            publicStart: publicStart,
            arrivalBack: wayPoints.length > 0 ? wayPoints[wayPoints.length - 1].backArrival : backupDate,
            arrivalFront: wayPoints.length > 0 ? wayPoints[wayPoints.length - 1].frontPassage : backupDate,
            distanceInKm: distance,
            peopleCount: track.peopleCount,
            wayPoints: wayPoints,
        };
    });
};

function getPointsEndingAtTime(gpxOrBreak: ParsedGpxSegment, endTime: number): ParsedPoint[] {
    const points = gpxOrBreak.points;
    const secondsOfSegment = points[points.length - 1].t;

    return points.map((point) => ({ ...point, t: endTime + (point.t - secondsOfSegment) }));
}

function getPreviousPoint(trackPoints: AggregatedPoints[], arrivalDate: string) {
    if (trackPoints.length > 0) {
        return trackPoints[0];
    }
    return {
        streetName: null,
        postCode: null,
        district: null,
        frontArrival: arrivalDate,
        frontPassage: arrivalDate,
        backArrival: arrivalDate,
        pointFrom: { lat: 0, lon: 0, time: arrivalDate },
        pointTo: { lat: 0, lon: 0, time: arrivalDate },
    };
}

export function getWayPointsOfTrack(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[],
    nodes: NodePosition[],
    participantsDelayInSeconds: number,
    lookups: Lookups,
    arrivalDateTime: string | undefined
): AggregatedPoints[] {
    let arrivalTimeForPreviousSegment = track.delayAtEndInSeconds ?? 0;
    let trackPoints: AggregatedPoints[] = [];
    const arrivalDate = arrivalDateTime ?? '2025-06-01T10:11:55';

    const gpxSegmentContents = resolveGpxSegments(track, gpxSegments, nodes);

    gpxSegmentContents
        .reverse()
        .filter((entry) => entry !== undefined)
        .forEach((gpxOrBreak) => {
            if (instanceOfBreak(gpxOrBreak)) {
                arrivalTimeForPreviousSegment = arrivalTimeForPreviousSegment - gpxOrBreak.minutes * 60;
                const trackBreak: AggregatedPoints = {
                    streetName: getPreviousPoint(trackPoints, arrivalDate).streetName,
                    breakLength: gpxOrBreak.minutes,
                    type: TrackWayPointType.Break,
                    pointTo: getPreviousPoint(trackPoints, arrivalDate).pointFrom,
                    pointFrom: getPreviousPoint(trackPoints, arrivalDate).pointFrom,
                    frontArrival: shiftDateBySeconds(
                        getPreviousPoint(trackPoints, arrivalDate).frontArrival,
                        -gpxOrBreak.minutes * 60
                    ),
                    backArrival: shiftDateBySeconds(
                        getPreviousPoint(trackPoints, arrivalDate).frontArrival,
                        -gpxOrBreak.minutes * 60 + participantsDelayInSeconds * (track.peopleCount ?? 0)
                    ),
                    frontPassage: shiftDateBySeconds(
                        getPreviousPoint(trackPoints, arrivalDate).frontArrival,
                        -gpxOrBreak.minutes * 60
                    ),
                    speed: undefined,
                    postCode: '',
                    distanceInKm: undefined,
                    district: '',
                };
                trackPoints = [trackBreak, ...trackPoints];
            } else if (instanceOfNode(gpxOrBreak)) {
                const trackNode: AggregatedPoints = {
                    ...getPreviousPoint(trackPoints, arrivalDate),
                    streetName: getPreviousPoint(trackPoints, arrivalDate).streetName,
                    type: TrackWayPointType.Node,
                    nodeTracks: gpxOrBreak.tracks,
                    pointTo: getPreviousPoint(trackPoints, arrivalDate).pointFrom,
                    pointFrom: getPreviousPoint(trackPoints, arrivalDate).pointFrom,
                    frontArrival: getPreviousPoint(trackPoints, arrivalDate).frontArrival,
                    backArrival: shiftDateBySeconds(
                        getPreviousPoint(trackPoints, arrivalDate).frontArrival,
                        participantsDelayInSeconds * (track.peopleCount ?? 0)
                    ),
                    speed: undefined,
                    postCode: '',
                    distanceInKm: undefined,
                    district: '',
                };
                trackPoints = [trackNode, ...trackPoints];
            } else {
                const shiftedPoint = getPointsEndingAtTime(gpxOrBreak, arrivalTimeForPreviousSegment);
                arrivalTimeForPreviousSegment = shiftedPoint[0].t;
                const points = shiftedPoint.map((point) => ({
                    ...point,
                    t: shiftDateBySeconds(arrivalDate, point.t),
                }));
                const aggregatedPoints = aggregatePoints(
                    points,
                    track.peopleCount ?? 0,
                    participantsDelayInSeconds,
                    lookups.streets,
                    lookups.districts,
                    lookups.postCodes
                );

                trackPoints = [...aggregatedPoints, ...trackPoints];
            }
        });

    return trackPoints;
}

export function resolveGpxSegments(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[],
    nodes: NodePosition[]
): (ParsedGpxSegment | Break | NodePosition)[] {
    const trackElements: (ParsedGpxSegment | Break | NodePosition)[] = [];
    track.segments.forEach((trackElement) => {
        if (trackElement.type === BREAK) {
            const minutes = trackElement.minutes;
            trackElements.push({ minutes });
        }
        const foundNodeBefore = nodes.find((node) => node.segmentIdAfter === trackElement.id);
        if (foundNodeBefore) {
            trackElements.push(foundNodeBefore);
        }
        const gpxSegment = gpxSegments.find((segment) => segment.id === trackElement.id);
        if (gpxSegment) {
            trackElements.push(gpxSegment);
        }
    });
    return trackElements;
}
