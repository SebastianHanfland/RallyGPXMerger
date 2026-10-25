import { BlockedStreetInfo, WayPoint } from '../logic/resolving/types';

export function wayPointHasUnknown(wayPoint: WayPoint | BlockedStreetInfo, unknown: string) {
    return (
        wayPoint.streetName === unknown ||
        !wayPoint.streetName ||
        wayPoint.postCode === undefined ||
        wayPoint.district === undefined
    );
}
