import { AggregatedPoints } from '../../logic/resolving/types.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';
import { isDefined } from '../../../utils/typeUtil.ts';

export function getSegmentInfo(aggregatedInfo: AggregatedPoints[] | undefined) {
    if (!aggregatedInfo) {
        return undefined;
    }
    if (aggregatedInfo.length === 0) {
        return undefined;
    }
    let distance = 0;
    const seconds = aggregatedInfo[aggregatedInfo.length - 1].frontPassage - aggregatedInfo[0].frontArrival;
    aggregatedInfo.forEach((info) => {
        distance += info.distanceInKm ?? 0;
    });
    const speed = seconds > 0 ? (distance / seconds) * 3600 : undefined;

    const speedString = speed ? `${formatNumber(speed)} km/h` : undefined;

    const minutesString = `${formatNumber(seconds / 60, 1)} min`;
    const distanceString = `${formatNumber(distance, 2)} km`;
    return [distanceString, speedString, minutesString].filter(isDefined).join(', ');
}
