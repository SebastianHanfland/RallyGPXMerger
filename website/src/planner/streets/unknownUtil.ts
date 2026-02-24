import { BlockedStreetInfo, WayPoint } from '../logic/resolving/types.ts';

export function wayPointHasUnknown(wayPoint: WayPoint | BlockedStreetInfo, unknown: string) {
    return (
        wayPoint.streetName === unknown ||
        !wayPoint.streetName ||
        wayPoint.postCode === undefined ||
        wayPoint.district === undefined
    );
}
