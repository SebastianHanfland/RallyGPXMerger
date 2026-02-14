import { State, TimedPoint } from '../../../store/types.ts';
import { TrackStreetInfo } from '../types.ts';
import { aggregateEnrichedPoints } from './aggregateEnrichedPoints.ts';
import geoDistance from 'geo-distance-helper';
import { geoCodingActions, getStreetNameReplacementWayPoints } from '../../../store/geoCoding.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';
import { getNodePositions } from '../selectors/getNodePositions.ts';
import { CalculatedTrack } from '../../../../common/types.ts';
import { getLatLng } from '../../../../utils/pointUtil.ts';
import { roundPublishedStartTimes } from '../../../../utils/dateUtil.ts';
import { getTrackCompositions } from '../../../store/trackMerge.reducer.ts';
import { overwriteWayPoints } from './overwriteWayPoints.ts';
import { getCalculatedTracks } from '../../../store/calculatedTracks.reducer.ts';
import { getStreetLookup } from '../../../store/segmentData.redux.ts';

function calculateDistance(track: CalculatedTrack): number {
    const points = track.points;
    let lastPoint: TimedPoint | null = null;
    let distance = 0;
    points.forEach((point) => {
        if (lastPoint === null) {
            lastPoint = point;
        } else {
            distance += geoDistance(getLatLng(point), getLatLng(lastPoint)) as number;
        }
        lastPoint = point;

        return {
            ...point,
            time: point.t,
        };
    });
    return distance;
}

const enrichWithStreetsAndAggregate =
    (state: State) =>
    (track: CalculatedTrack): TrackStreetInfo => {
        const replacementWayPoints = getStreetNameReplacementWayPoints(state) ?? [];
        const tracks = getTrackCompositions(state);
        const streetLookup = getStreetLookup(state);
        const nodePositions = getNodePositions(state);
        const trackComposition = tracks.find((trackComp) => trackComp.id === track.id);
        const distance = calculateDistance(track);

        const wayPoints = aggregateEnrichedPoints(track.points, track.peopleCount ?? 0, nodePositions, streetLookup);
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
    const calculatedTracks = getCalculatedTracks(getState());
    const trackStreetInfos = calculatedTracks?.map(enrichWithStreetsAndAggregate(getState())) ?? [];
    dispatch(geoCodingActions.setTrackStreetInfos(trackStreetInfos));
    return Promise.resolve();
}
