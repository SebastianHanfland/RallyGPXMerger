import { State } from '../store/types.ts';
import { BlockedStreetInfo } from './types.ts';
import { getTrackStreetInfo } from './getTrackStreetInfo.ts';

export function getBlockedStreetInfo(state: State): BlockedStreetInfo[] {
    const trackStreetInfo = getTrackStreetInfo(state);

    return [];
}
