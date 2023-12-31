import { CalculatedTrack, State } from '../store/types.ts';
import { TrackStreetInfo } from './types.ts';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { toKey } from './initializeResolvedPositions.ts';
import { aggregateEnrichedPoints } from './aggregateEnrichedPoints.ts';
import { Point } from 'gpxparser';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../logic/speedSimulator.ts';
import { geoCodingActions, getResolvedPositions } from '../store/geoCoding.reducer.ts';
import { Dispatch } from '@reduxjs/toolkit';

const enrichWithStreetsAndAggregate =
    (state: State) =>
    (track: CalculatedTrack): TrackStreetInfo => {
        const resolvedPositions = getResolvedPositions(state);

        const gpx = SimpleGPX.fromString(track.content);
        const points = gpx.tracks.flatMap((track) => track.points);
        let lastPoint: Point | null = null;
        let distance = 0;
        const enrichedPoints = points.map((point) => {
            if (lastPoint === null) {
                lastPoint = point;
            } else {
                distance += geoDistance(toLatLng(point), toLatLng(lastPoint)) as number;
            }
            const positionKey = toKey(point);
            const street = resolvedPositions[positionKey] ?? 'Unknown';
            lastPoint = point;

            return {
                ...point,
                time: point.time.toISOString(),
                street,
            };
        });

        const wayPoints = aggregateEnrichedPoints(enrichedPoints, track.peopleCount ?? 0);

        return {
            id: track.id,
            name: track.filename,
            startFront: wayPoints[0].frontArrival,
            arrivalBack: wayPoints[wayPoints.length - 1].backArrival,
            arrivalFront: wayPoints[wayPoints.length - 1].frontPassage,
            distanceInKm: distance,
            wayPoints,
        };
    };

export async function calculateTrackStreetInfos(dispatch: Dispatch, getState: () => State) {
    const calculatedTracks = getCalculatedTracks(getState());
    const trackStreetInfos = calculatedTracks.map(enrichWithStreetsAndAggregate(getState()));
    dispatch(geoCodingActions.setTrackStreetInfos(trackStreetInfos));
}
