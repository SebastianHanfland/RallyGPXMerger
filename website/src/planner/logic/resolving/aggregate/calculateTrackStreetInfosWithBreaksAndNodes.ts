import { AggregatedPoints, TrackWayPointType } from '../types.ts';
import { createSelector } from '@reduxjs/toolkit';
import { roundPublishedStartTimes, shiftDateBySeconds } from '../../../../utils/dateUtil.ts';
import { getArrivalDateTime, getParticipantsDelay, getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { getLookups, Lookups } from '../selectors/getLookups.ts';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';
import { updateExtraDelayOnTracks } from '../../calculate/solver.ts';
import { BREAK, ParsedGpxSegment, ParsedPoint, TrackComposition } from '../../../store/types.ts';
import { Break, instanceOfBreak, instanceOfNode } from '../../calculate/types.ts';
import { getNodePositions, NodePosition } from '../selectors/getNodePositions.ts';
import { aggregatePoints } from './aggregatePoints.ts';
import { getCalculatedTracks } from '../../../store/calculatedTracks.reducer.ts';
import { calculateDistanceInKm } from './calculateDistanceInKm.ts';

export const getTrackStreetInfos = createSelector(
    [
        getParsedGpxSegments,
        getTrackCompositions,
        getLookups,
        getParticipantsDelay,
        getNodePositions,
        getArrivalDateTime,
        getCalculatedTracks,
    ],
    (segments, tracks, lookups, participantsDelayInSeconds, nodes, arrivalDateTime, calculatedTracks) => {
        const trackWithEndDelay = updateExtraDelayOnTracks(tracks, participantsDelayInSeconds);

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

            const startFront = wayPoints[0].frontArrival;
            const publicStart = track
                ? roundPublishedStartTimes(startFront, track.buffer ?? 0, track.rounding ?? 0)
                : startFront;

            return {
                id: track.id,
                name: track.name ?? track.id,
                startFront: startFront,
                publicStart: publicStart,
                arrivalBack: wayPoints[wayPoints.length - 1].backArrival,
                arrivalFront: wayPoints[wayPoints.length - 1].frontPassage,
                distanceInKm: distance,
                peopleCount: track.peopleCount,
                wayPoints: wayPoints,
            };
        });
    }
);

function getPointsEndingAtTime(gpxOrBreak: ParsedGpxSegment, endTime: number): ParsedPoint[] {
    const points = gpxOrBreak.points;
    const secondsOfSegment = points[points.length - 1].t;

    return points.map((point) => ({ ...point, t: endTime + (point.t - secondsOfSegment) }));
}

export function getWayPointsOfTrack(
    track: TrackComposition,
    gpxSegments: ParsedGpxSegment[],
    nodes: NodePosition[],
    participantsDelayInSeconds: number,
    lookups: Lookups,
    arrivalDate: string | undefined
): AggregatedPoints[] {
    let arrivalTimeForPreviousSegment = track.delayAtEndInSeconds ?? 0;
    let trackPoints: AggregatedPoints[] = [];

    const gpxSegmentContents = resolveGpxSegments(track, gpxSegments, nodes);

    gpxSegmentContents
        .reverse()
        .filter((entry) => entry !== undefined)
        .forEach((gpxOrBreak) => {
            if (instanceOfBreak(gpxOrBreak)) {
                arrivalTimeForPreviousSegment = arrivalTimeForPreviousSegment - gpxOrBreak.minutes * 60;
                const trackBreak: AggregatedPoints = {
                    streetName: trackPoints[0].streetName,
                    breakLength: gpxOrBreak.minutes,
                    type: TrackWayPointType.Break,
                    pointTo: trackPoints[0].pointFrom,
                    pointFrom: trackPoints[0].pointFrom,
                    frontArrival: shiftDateBySeconds(trackPoints[0].frontArrival, -gpxOrBreak.minutes * 60),
                    backArrival: shiftDateBySeconds(
                        trackPoints[0].frontArrival,
                        -gpxOrBreak.minutes * 60 + participantsDelayInSeconds * (track.peopleCount ?? 0)
                    ),
                    frontPassage: shiftDateBySeconds(trackPoints[0].frontArrival, -gpxOrBreak.minutes * 60),
                    speed: undefined,
                    postCode: '',
                    distanceInKm: undefined,
                    district: '',
                };
                trackPoints = [trackBreak, ...trackPoints];
            } else if (instanceOfNode(gpxOrBreak)) {
                const trackNode: AggregatedPoints = {
                    ...trackPoints[0],
                    streetName: trackPoints[0].streetName,
                    type: TrackWayPointType.Node,
                    nodeTracks: gpxOrBreak.tracks,
                    pointTo: trackPoints[0].pointFrom,
                    pointFrom: trackPoints[0].pointFrom,
                    frontArrival: trackPoints[0].frontArrival,
                    backArrival: shiftDateBySeconds(
                        trackPoints[0].frontArrival,
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
                const arrivalDateTime = arrivalDate ?? '2025-06-01T10:11:55';
                const points = shiftedPoint.map((point) => ({
                    ...point,
                    t: shiftDateBySeconds(arrivalDateTime, point.t),
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
