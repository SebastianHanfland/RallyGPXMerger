import { getBlockedStreetInfo } from '../getBlockedStreetInfo.ts';
import { Mock } from 'vitest';
import { BlockedStreetInfo, TrackStreetInfo } from '../types.ts';
import { State } from '../../store/types.ts';
import { getEnrichedTrackStreetInfos } from '../getEnrichedTrackStreetInfos.ts';

vi.mock('../getEnrichedTrackStreetInfos.ts');

describe('getBlockedStreetInfo', () => {
    it('should work with empty lists', () => {
        // given
        const trackStreetInfos: TrackStreetInfo[] = [];
        (getEnrichedTrackStreetInfos as Mock).mockReturnValue(trackStreetInfos);

        // when
        const blockedStreetInfo = getBlockedStreetInfo({} as State);

        // then
        expect(blockedStreetInfo).toEqual([]);
    });

    it('should take earliest from and latest to date for a street with the same name', () => {
        // given
        const earliestStart = '2022-02-02T02:00:00.000Z';
        const latestEnd = '2022-02-02T02:20:00.000Z';
        const trackStreetInfos: TrackStreetInfo[] = [
            {
                wayPoints: [{ streetName: 'A', frontArrival: '2022-02-02T02:10:00.000Z', backArrival: latestEnd }],
            },
            {
                wayPoints: [{ streetName: 'A', frontArrival: earliestStart, backArrival: '2022-02-02T02:10:00.000Z' }],
            },
        ] as TrackStreetInfo[];
        (getEnrichedTrackStreetInfos as Mock).mockReturnValue(trackStreetInfos);
        const expectedBlockedStreets: BlockedStreetInfo[] = [
            { streetName: 'A', frontArrival: earliestStart, backPassage: latestEnd } as BlockedStreetInfo,
        ];

        // when
        const blockedStreetInfo = getBlockedStreetInfo({} as State);

        // then
        expect(blockedStreetInfo).toEqual(expectedBlockedStreets);
    });
});
