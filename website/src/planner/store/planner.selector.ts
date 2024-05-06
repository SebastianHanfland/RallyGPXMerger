import { State } from './types.ts';
import { getArrivalDateTime, getTrackCompositions } from './trackMerge.reducer.ts';
import { getGpxSegments } from './gpxSegments.reducer.ts';

export const isPlanningInProgress = (state: State) =>
    !!getArrivalDateTime(state) || getGpxSegments(state).length > 0 || getTrackCompositions(state).length > 0;
