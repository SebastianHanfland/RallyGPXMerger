import { getBlockedStreetInfo } from '../getBlockedStreetInfo.ts';
import { getTrackStreetInfo } from '../getTrackStreetInfo.ts';
import { Mock } from 'vitest';
import { TrackStreetInfo } from '../types.ts';
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
});
