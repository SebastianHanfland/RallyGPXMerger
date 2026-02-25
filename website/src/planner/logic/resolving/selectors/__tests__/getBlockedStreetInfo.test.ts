import { getBlockedStreetInfo } from '../getBlockedStreetInfo.ts';
import { Mock } from 'vitest';
import { BlockedStreetInfo, TrackStreetInfo, TrackWayPointType } from '../../types.ts';
import { State, TrackComposition } from '../../../../store/types.ts';
import { getTrackStreetInfos } from '../../../../calculation/getTrackStreetInfos.ts';

vi.mock('../../../../calculation/getTrackStreetInfos.ts');

describe('getBlockedStreetInfo', () => {
    it('should work with empty lists', () => {
        // given
        const trackStreetInfos: TrackStreetInfo[] = [];
        const trackCompositions: TrackComposition[] = [];
        (getTrackStreetInfos as unknown as Mock).mockReturnValue(trackStreetInfos);

        // when
        const blockedStreetInfo = getBlockedStreetInfo({
            trackMerge: { trackCompositions: trackCompositions },
        } as State);

        // then
        expect(blockedStreetInfo).toEqual([]);
    });

    it('should take earliest from and latest to date for a street with the same name and not double count people', () => {
        // given
        const earliestStart = '2022-02-02T02:00:00.000Z';
        const latestEnd = '2022-02-02T02:20:00.000Z';
        const trackStreetInfos: TrackStreetInfo[] = [
            {
                id: '1',
                wayPoints: [
                    {
                        streetName: 'A',
                        frontArrival: '2022-02-02T02:10:00.000Z',
                        backPassage: '2022-02-02T02:12:00.000Z',
                        type: TrackWayPointType.Track,
                    },
                    {
                        streetName: 'A',
                        frontArrival: '2022-02-02T02:14:00.000Z',
                        backPassage: latestEnd,
                        type: TrackWayPointType.Track,
                    },
                ],
            },
            {
                id: '2',
                wayPoints: [
                    {
                        streetName: 'A',
                        frontArrival: earliestStart,
                        backPassage: '2022-02-02T02:10:00.000Z',
                        type: TrackWayPointType.Track,
                    },
                ],
            },
        ] as TrackStreetInfo[];
        const trackCompositions: TrackComposition[] = [
            { id: '1', peopleCount: 10 } as TrackComposition,
            { id: '2', peopleCount: 20 } as TrackComposition,
        ];

        (getTrackStreetInfos as unknown as Mock).mockReturnValue(trackStreetInfos);
        const expectedBlockedStreets: BlockedStreetInfo[] = [
            {
                streetName: 'A',
                frontArrival: earliestStart,
                backPassage: latestEnd,
                peopleCount: 30,
                tracksIds: ['1', '2'],
            } as BlockedStreetInfo,
        ];

        // when
        const blockedStreetInfo = getBlockedStreetInfo({
            trackMerge: { trackCompositions: trackCompositions },
        } as State);

        // then
        expect(blockedStreetInfo).toEqual(expectedBlockedStreets);
    });
});
