import { State } from '../store/types.ts';
import { BlockedStreetInfo } from './types.ts';
import { getTrackStreetInfos } from '../store/geoCoding.reducer.ts';

function takeLaterOne(end: string, to: string): string {
    return end >= to ? end : to;
}

function takeEarlierOne(start: string, from: string): string {
    return start <= from ? start : from;
}

export function getBlockedStreetInfo(state: State): BlockedStreetInfo[] {
    let blockedStreetsInfo: BlockedStreetInfo[] = [];
    const trackStreetInfo = getTrackStreetInfos(state);
    trackStreetInfo.forEach((trackStreetInfo) => {
        trackStreetInfo.wayPoints.forEach((waypoint) => {
            if (!blockedStreetsInfo.find((info) => info.streetName === waypoint.streetName)) {
                blockedStreetsInfo.push({ streetName: waypoint.streetName, start: waypoint.from, end: waypoint.to });
                return;
            }
            blockedStreetsInfo = blockedStreetsInfo.map((info) =>
                info.streetName === waypoint.streetName
                    ? {
                          ...info,
                          end: takeLaterOne(info.end, waypoint.to),
                          start: takeEarlierOne(info.start, waypoint.from),
                      }
                    : info
            );
        });
    });

    return blockedStreetsInfo;
}
