import { BlockedStreetInfo } from '../../mapMatching/types.ts';

export function convertStreetInfoToCsv(blockedStreets: BlockedStreetInfo[]): string {
    return (
        'Post code;District;Street;Blocked from;Blocked until;\n' +
        blockedStreets
            .map(
                ({ postCode, district, streetName, frontArrival, backPassage }) =>
                    `${postCode};${district};${streetName};${frontArrival};${backPassage}`
            )
            .join('\n')
    );
}
