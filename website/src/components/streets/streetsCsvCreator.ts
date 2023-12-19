import { BlockedStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';
import { getLanguage } from '../../language.ts';

const englishHeader = 'Post code;District;Street;Blocked from;Blocked until;';
const germanHeader = 'PLZ;Bezirk;Straße;Blockiert von;Blockiert bis;';

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
                ({ postCode, district, streetName, frontArrival, backPassage }) =>
                    `${postCode ?? ''};` +
                    `${district ?? ''};` +
                    `${streetName};` +
                    `${formatTimeOnly(frontArrival)};` +
                    `${formatTimeOnly(backPassage)}`
            )
            .join('\n')
    );
}
