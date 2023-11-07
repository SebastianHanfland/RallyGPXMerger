import { getBlockedStreetInfo } from '../getBlockedStreetInfo.ts';
import { getTrackStreetInfo } from '../getTrackStreetInfo.ts';
import { Mock } from 'vitest';
import { BlockedStreetInfo, TrackStreetInfo } from '../types.ts';
import { State } from '../../store/types.ts';

vi.mock('../getTrackStreetInfo.ts');

describe('getBlockedStreetInfo', () => {
    it('should work with empty lists', () => {
        // given
        const trackStreetInfos: TrackStreetInfo[] = [];
        (getTrackStreetInfo as Mock).mockReturnValue(trackStreetInfos);

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
                wayPoints: [{ streetName: 'A', from: '2022-02-02T02:10:00.000Z', to: latestEnd }],
            },
            {
                wayPoints: [{ streetName: 'A', from: earliestStart, to: '2022-02-02T02:10:00.000Z' }],
            },
        ] as TrackStreetInfo[];
        (getTrackStreetInfo as Mock).mockReturnValue(trackStreetInfos);
        const expectedBlockedStreets: BlockedStreetInfo[] = [{ streetName: 'A', start: earliestStart, end: latestEnd }];

        // when
        const blockedStreetInfo = getBlockedStreetInfo({} as State);

        // then
        expect(blockedStreetInfo).toEqual(expectedBlockedStreets);
    });
});
