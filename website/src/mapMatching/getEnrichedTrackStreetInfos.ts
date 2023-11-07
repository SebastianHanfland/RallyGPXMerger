import { getResolvedPostCodes, getTrackStreetInfos } from '../store/geoCoding.reducer.ts';
import { State } from '../store/types.ts';
import { TrackStreetInfo } from './types.ts';
import { getWayPointKey } from './postCodeResolver.ts';

export const getEnrichedTrackStreetInfos = (state: State): TrackStreetInfo[] => {
    const trackStreetInfos = getTrackStreetInfos(state);
    const resolvedPostCodes = getResolvedPostCodes(state);

    return trackStreetInfos.map((info) => ({
        ...info,
        wayPoints: info.wayPoints.map((wayPoint) => {
            const postCodeKey = getWayPointKey(wayPoint).postCodeKey;
            return { ...wayPoint, postCode: resolvedPostCodes[postCodeKey] };
        }),
    }));
};
