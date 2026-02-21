import { State } from './types.ts';
import { getTrackCompositions } from './trackMerge.reducer.ts';
import { getParsedGpxSegments } from './segmentData.redux.ts';
import { getArrivalDateTime } from './settings.reducer.ts';

export const isPlanningInProgress = (state: State) =>
    !!getArrivalDateTime(state) || getParsedGpxSegments(state).length > 0 || getTrackCompositions(state).length > 0;
