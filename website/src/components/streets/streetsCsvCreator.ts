import { BlockedStreetInfo } from '../../mapMatching/types.ts';
import { formatTimeOnly } from '../../utils/dateUtil.ts';

export function convertStreetInfoToCsv(blockedStreets: BlockedStreetInfo[]): string {
    return (
        'Post code;District;Street;Blocked from;Blocked until;\n' +
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
