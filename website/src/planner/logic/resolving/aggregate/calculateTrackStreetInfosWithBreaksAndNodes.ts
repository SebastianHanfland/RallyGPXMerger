import { AggregatedPoints, TrackStreetInfo, TrackWayPointType } from '../types.ts';
import { createSelector } from '@reduxjs/toolkit';
import { CalculatedTrack } from '../../../../common/types.ts';
import { roundPublishedStartTimes } from '../../../../utils/dateUtil.ts';
import { getParticipantsDelay, getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { calculateDistanceInKm } from './calculateDistanceInKm.ts';
import { getLookups } from '../selectors/getLookups.ts';
import { getParsedGpxSegments } from '../../../store/segmentData.redux.ts';
import { updateExtraDelayOnTracks } from '../../calculate/solver.ts';
import { BREAK, ParsedGpxSegment, ParsedPoint, TrackComposition } from '../../../store/types.ts';
import { Break, instanceOfBreak, instanceOfNode } from '../../calculate/types.ts';
import { getNodePositions, NodePosition } from '../selectors/getNodePositions.ts';

export const getTrackStreetInfos = createSelector(
    [getParsedGpxSegments, getTrackCompositions, getLookups, getParticipantsDelay, getNodePositions],
    (segments, tracks, lookups, participantsDelayInSeconds, nodes) => {
        const { streets, districts, postCodes } = lookups;
        // Calculating end time is one thing
        // iterating through segments
        // aggregation
        // converting to track points

        const trackWithEndDelay = updateExtraDelayOnTracks(tracks, participantsDelayInSeconds);
        return trackWithEndDelay.map((track) => {
            return tracks.map((track: CalculatedTrack): TrackStreetInfo => {
                const distance = calculateDistanceInKm(track.points);

                const wayPoints = getWayPointsOfTrack(track, segments, nodes);

                const startFront = wayPoints[0].frontArrival;
                const publicStart = trackComposition
                    ? roundPublishedStartTimes(startFront, trackComposition.buffer ?? 0, trackComposition.rounding ?? 0)
                    : startFront;

                return {
                    id: track.id,
                    name: track.filename,
                    startFront: startFront,
                    publicStart: publicStart,
                    arrivalBack: wayPoints[wayPoints.length - 1].backArrival,
                    arrivalFront: wayPoints[wayPoints.length - 1].frontPassage,
                    distanceInKm: distance,
                    peopleCount: track.peopleCount,
                    wayPoints: wayPoints,
                };
            });
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
    nodes: NodePosition[]
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
                    ...trackPoints[0],
                    breakLength: gpxOrBreak.minutes,
                    type: TrackWayPointType.Break,
                };
                trackPoints = [trackBreak, ...trackPoints];
            } else if (instanceOfNode(gpxOrBreak)) {
                const trackNode: AggregatedPoints = {
                    ...trackPoints[0],
                    type: TrackWayPointType.Node,
                    nodeTracks: gpxOrBreak.tracks,
                };
                trackPoints = [trackNode, ...trackPoints];
            } else {
                const shiftedPoint = getPointsEndingAtTime(gpxOrBreak, arrivalTimeForPreviousSegment);
                arrivalTimeForPreviousSegment = shiftedPoint[0].t;

                trackPoints = [...shiftedPoint, ...trackPoints];
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
    const nodesOfTrack = nodes.filter((node) => node.tracks.includes(track.id));
    track.segments.forEach((trackElement) => {
        if (trackElement.type === BREAK) {
            const minutes = trackElement.minutes;
            trackElements.push({ minutes });
        }
        const foundNodeBefore = nodesOfTrack.find((node) => node.segmentIdAfter === trackElement.id);
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
