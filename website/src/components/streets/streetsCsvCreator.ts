import { BlockedStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly, getTimeDifferenceInSeconds } from '../../utils/dateUtil.ts';
import { getLanguage } from '../../language.ts';
import geoDistance from 'geo-distance-helper';
import { toLatLng } from '../../logic/speedSimulator.ts';
import { formatNumber } from './trackCsvCreator.ts';

const englishHeader = 'Post code;District;Street;Length in km;Blockage in min;Blocked from;Blocked until';
const germanHeader = 'PLZ;Bezirk;Straße;Länge in km;Blockiert Dauer in min;Blockiert von;Blockiert bis';

const getHeader = () => {
    const language = getLanguage();
    switch (language) {
        case 'de':
            return germanHeader;
        case 'en':
            return englishHeader;
    }
};

export function convertStreetInfoToCsv(blockedStreets: BlockedStreetInfo[]): string {
    return (
        getHeader() +
        '\n' +
        blockedStreets
            .map(
                ({ postCode, district, streetName, frontArrival, backPassage, pointTo, pointFrom }) =>
                    `${postCode ?? ''};` +
                    `${district ?? ''};` +
                    `${streetName};` +
                    `${formatNumber(geoDistance(toLatLng(pointFrom), toLatLng(pointTo)) as number, 2)};` +
                    `${formatNumber(getTimeDifferenceInSeconds(backPassage, frontArrival) / 60, 1)};` +
                    `${formatTimeOnly(frontArrival)};` +
                    `${formatTimeOnly(backPassage)}`
            )
            .join('\n')
    );
}
