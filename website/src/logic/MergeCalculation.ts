import { State } from '../store/types.ts';
import { AppDispatch } from '../store/store.ts';
import { getGpxSegments } from '../store/gpxSegments.reducer.ts';
import { getTrackCompositions } from '../store/trackMerge.reducer.ts';
import { calculatedTracksActions } from '../store/calculatedTracks.reducer.ts';

export function calculateMerge(dispatch: AppDispatch, getState: () => State) {
    const gpxSegments = getGpxSegments(getState());
    const trackCompositions = getTrackCompositions(getState());

    console.log({ gpxSegments, trackCompositions, dispatch });

    const createCalculatedTracks = trackCompositions.map((track) => ({
        id: track.id,
        filename: `${track.name}.gpx`,
        content: '1234',
    }));

    dispatch(calculatedTracksActions.setCalculatedTracks(createCalculatedTracks));
}
