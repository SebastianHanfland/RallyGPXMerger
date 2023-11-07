import { CalculatedTrack, State } from '../store/types.ts';
import { TrackStreetInfo } from './types.ts';
import { getCalculatedTracks, getTrackParticipants } from '../store/calculatedTracks.reducer.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { toKey } from './initializeResolvedPositions.ts';
import { aggregateEnrichedPoints } from './aggregateEnrichedPoints.ts';
import { Point } from 'gpxparser';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../logic/speedSimulator.ts';
import { getResolvedPositions } from '../store/geoCoding.reducer.ts';

const enrichWithStreetsAndAggregate =
    (state: State) =>
    (track: CalculatedTrack, index: number): TrackStreetInfo => {
        const resolvedPositions = getResolvedPositions(state);
        const participants = getTrackParticipants(state);

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

        const wayPoints = aggregateEnrichedPoints(enrichedPoints, participants[index]);

        return {
            id: track.id,
            name: track.filename,
            start: points[0].time.toISOString(),
            end: points[points.length - 1].time.toISOString(),
            distanceInKm: distance,
            wayPoints,
        };
    };

export function getTrackStreetInfo(state: State): TrackStreetInfo[] {
    const calculatedTracks = getCalculatedTracks(state);
    return calculatedTracks.map(enrichWithStreetsAndAggregate(state));
}
