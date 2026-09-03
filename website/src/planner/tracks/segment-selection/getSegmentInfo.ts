import { AggregatedPoints } from '../../logic/resolving/types.ts';
import { formatNumber } from '../../../utils/numberUtil.ts';
import { isDefined } from '../../../utils/typeUtil.ts';

export function getSegmentSpeed(aggregatedInfo: AggregatedPoints[] | undefined) {
    if (!aggregatedInfo || aggregatedInfo.length === 0) {
        return undefined;
    }

    let distance = 0;
    aggregatedInfo.forEach((info) => {
        distance += info.distanceInKm ?? 0;
    });
    const seconds = aggregatedInfo[aggregatedInfo.length - 1].frontPassage - aggregatedInfo[0].frontArrival;
    return seconds > 0 ? (distance / seconds) * 3600 : undefined;
}

export function getSegmentInfo(aggregatedInfo: AggregatedPoints[] | undefined) {
    if (!aggregatedInfo) {
        return undefined;
    }
    if (aggregatedInfo.length === 0) {
        return undefined;
    }
    const seconds = aggregatedInfo[aggregatedInfo.length - 1].frontPassage - aggregatedInfo[0].frontArrival;
    const distance = aggregatedInfo.reduce((sum, info) => sum + (info.distanceInKm ?? 0), 0);
    const speed = getSegmentSpeed(aggregatedInfo);

    const speedString = speed ? `${formatNumber(speed)} km/h` : undefined;

    const minutesString = `${formatNumber(seconds / 60, 1)} min`;
    const distanceString = `${formatNumber(distance, 2)} km`;
    return [distanceString, speedString, minutesString].filter(isDefined).join(', ');
}
