import { State } from './types';
import { getTrackCompositions } from './trackMerge.reducer';
import { getParsedGpxSegments } from './segmentData.redux';
import { getArrivalDateTime } from './settings.reducer';

export const isPlanningInProgress = (state: State) =>
    !!getArrivalDateTime(state) || getParsedGpxSegments(state).length > 0 || getTrackCompositions(state).length > 0;
