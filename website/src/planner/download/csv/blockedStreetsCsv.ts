import { BlockedStreetInfo } from '../../logic/resolving/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../../utils/dateUtil.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/merge/speedSimulator.ts';
import { formatNumber } from './trackStreetsCsv.ts';
import { IntlShape } from 'react-intl';

export const getBlockedStreetsHeader = (intl: IntlShape) => {
    const headerKeys = [
        'msg.postCode',
        'msg.district',
        'msg.lengthInKm',
        'msg.blockageInMin',
        'msg.blockedFrom',
        'msg.blockedUntil',
    ];
    return headerKeys.map((key) => intl.formatMessage({ id: key })).join(';');
};

export function convertStreetInfoToCsv(blockedStreets: BlockedStreetInfo[], intl: IntlShape): string {
    return (
        getBlockedStreetsHeader(intl) +
        '\n' +
        blockedStreets
            .map(
                ({ postCode, district, streetName, frontArrival, backPassage, pointTo, pointFrom }) =>
                    `${postCode ?? ''};` +
                    `${district ?? ''};` +
                    `${streetName ?? intl.formatMessage({ id: 'msg.unknown' })};` +
                    `${formatNumber(geoDistance(toLatLng(pointFrom), toLatLng(pointTo)) as number, 2)};` +
                    `${formatNumber(getTimeDifferenceInSeconds(backPassage, frontArrival) / 60, 1)};` +
                    `${formatTimeOnly(frontArrival)};` +
                    `${formatTimeOnly(backPassage)}`
            )
            .join('\n')
    );
}
