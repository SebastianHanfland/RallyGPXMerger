import { State } from '../../../store/types.ts';
import { TrackStreetInfo } from '../types.ts';
import { aggregateEnrichedPoints } from './aggregateEnrichedPoints.ts';
import geoDistance from 'geo-distance-helper';
import {
    geoCodingActions,
    getResolvedPositions,
    getStreetNameReplacementWayPoints,
} from '../../../store/geoCoding.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { getNodePositions } from '../selectors/getNodePositions.ts';
import { ParsedTrack } from '../../../../common/types.ts';
import { toKey } from '../helper/pointKeys.ts';
import { geoCodingRequestsActions } from '../../../store/geoCodingRequests.reducer.ts';
import { toLatLng } from '../../../../utils/pointUtil.ts';
import { roundPublishedStartTimes } from '../../../../utils/dateUtil.ts';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { overwriteWayPoints } from './overwriteWayPoints.ts';
import { Point } from '../../../../utils/gpxTypes.ts';
import { getParsedTracks } from '../../../store/parsedTracks.reducer.ts';

const enrichWithStreetsAndAggregate =
    (state: State) =>
    (track: ParsedTrack): TrackStreetInfo => {
        const resolvedPositions = getResolvedPositions(state) ?? {};
        const replacementWayPoints = getStreetNameReplacementWayPoints(state) ?? [];
        const tracks = getTrackCompositions(state);
        const nodePositions = getNodePositions(state);
        const trackComposition = tracks.find((trackComp) => trackComp.id === track.id);

        const points = track.points;
        let lastPoint: Point | null = null;
        let distance = 0;
        const enrichedPoints = points.map((point) => {
            if (lastPoint === null) {
                lastPoint = point;
            } else {
                distance += geoDistance(toLatLng(point), toLatLng(lastPoint)) as number;
            }
            const positionKey = toKey(point);
            const street = resolvedPositions[positionKey] ?? null;
            lastPoint = point;

            return {
                ...point,
                time: point.time,
                street,
            };
        });

        const wayPoints = aggregateEnrichedPoints(enrichedPoints, track.peopleCount ?? 0, nodePositions);
        const overwrittenWayPoints = overwriteWayPoints(wayPoints, replacementWayPoints);

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
            wayPoints: overwrittenWayPoints,
        };
    };

export async function calculateTrackStreetInfos(dispatch: Dispatch, getState: () => State) {
    dispatch(geoCodingRequestsActions.setIsAggregating(true));
    const parsedTracks = getParsedTracks(getState());
    const trackStreetInfos = parsedTracks?.map(enrichWithStreetsAndAggregate(getState())) ?? [];
    dispatch(geoCodingActions.setTrackStreetInfos(trackStreetInfos));
    dispatch(geoCodingRequestsActions.setIsAggregating(false));
    return Promise.resolve();
}
