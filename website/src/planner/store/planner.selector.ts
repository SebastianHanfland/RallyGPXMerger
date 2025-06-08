import { State } from './types.ts';
import { getArrivalDateTime, getTrackCompositions } from './trackMerge.reducer.ts';
import { getParsedGpxSegments } from '../new-store/segmentData.redux.ts';

export const isPlanningInProgress = (state: State) =>
    !!getArrivalDateTime(state) || getParsedGpxSegments(state).length > 0 || getTrackCompositions(state).length > 0;
