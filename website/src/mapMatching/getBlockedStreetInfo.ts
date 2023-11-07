import { State } from '../store/types.ts';
import { BlockedStreetInfo } from './types.ts';
import { getTrackStreetInfo } from './getTrackStreetInfo.ts';

export function getBlockedStreetInfo(state: State): BlockedStreetInfo[] {
    let blockedStreetsInfo: BlockedStreetInfo[] = [];
    const trackStreetInfo = getTrackStreetInfo(state);
    trackStreetInfo.forEach((trackStreetInfo) => {
        trackStreetInfo.wayPoints.forEach((waypoint) => {
            if (!blockedStreetsInfo.find((info) => info.streetName === waypoint.streetName)) {
                blockedStreetsInfo.push({ streetName: waypoint.streetName, start: waypoint.from, end: waypoint.to });
                return;
            }
            blockedStreetsInfo = blockedStreetsInfo.map((info) =>
                info.streetName === waypoint.streetName ? { ...info, end: waypoint.to } : info
            );
        });
    });

    return blockedStreetsInfo;
}
