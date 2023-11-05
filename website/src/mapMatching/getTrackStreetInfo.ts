import { CalculatedTrack, State } from '../store/types.ts';
import { TrackStreetInfo } from './types.ts';
import { getCalculatedTracks } from '../store/calculatedTracks.reducer.ts';
import { SimpleGPX } from '../utils/SimpleGPX.ts';
import { toKey } from '../reverseGeoCoding/initializeResolvedPositions.ts';
import { storage } from '../store/storage.ts';
import { aggregateEnrichedPoints } from './aggregateEnrichedPoints.ts';

function enrichWithStreetsAndAggregate(track: CalculatedTrack): TrackStreetInfo {
    const resolvedPositions = storage.getResolvedPositions();

    const gpx = SimpleGPX.fromString(track.content);
    const enrichedPoints = gpx.tracks[0].points.map((point) => {
        const positionKey = toKey(point);
        const street = resolvedPositions[positionKey] ?? 'Unknown';
        return {
            ...point,
            time: point.time.toISOString(),
            street,
        };
    });

    const wayPoints = aggregateEnrichedPoints(enrichedPoints);

    return {
        name: track.filename,
        wayPoints,
    };
}

export function getTrackStreetInfo(state: State): TrackStreetInfo[] {
    const calculatedTracks = getCalculatedTracks(state);
    return calculatedTracks.map(enrichWithStreetsAndAggregate);
}
