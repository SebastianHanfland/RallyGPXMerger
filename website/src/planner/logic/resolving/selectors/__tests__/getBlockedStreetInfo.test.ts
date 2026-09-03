import { getBlockedStreetInfo } from '../getBlockedStreetInfo.ts';
import { Mock } from 'vitest';
import { BlockedStreetInfo, TrackStreetInfo, TrackWayPointType, WayPoint } from '../../types.ts';
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
                        postCode: '12345',
                        district: 'Central',
                        frontArrival: '2022-02-02T02:10:00.000Z',
                        backPassage: '2022-02-02T02:12:00.000Z',
                        type: TrackWayPointType.Track,
                        path: [
                            { lat: 48, lon: 11 },
                            { lat: 48.1, lon: 11.1 },
                        ],
                    },
                    {
                        streetName: 'A',
                        postCode: '12345',
                        district: 'Central',
                        frontArrival: '2022-02-02T02:14:00.000Z',
                        backPassage: latestEnd,
                        type: TrackWayPointType.Track,
                        path: [
                            { lat: 48.1, lon: 11.1 },
                            { lat: 48.2, lon: 11.2 },
                        ],
                    },
                ],
            },
            {
                id: '2',
                wayPoints: [
                    {
                        streetName: 'A',
                        postCode: '12345',
                        district: 'Central',
                        frontArrival: earliestStart,
                        backPassage: '2022-02-02T02:10:00.000Z',
                        type: TrackWayPointType.Track,
                        path: [
                            { lat: 48.3, lon: 11.3 },
                            { lat: 48.4, lon: 11.4 },
                        ],
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
                postCode: '12345',
                district: 'Central',
                frontArrival: earliestStart,
                backPassage: latestEnd,
                distanceInKm: undefined,
                peopleCount: 30,
                tracksIds: ['1', '2'],
                trackUsages: [
                    {
                        trackId: '1',
                        trackName: '1',
                        frontArrival: '2022-02-02T02:10:00.000Z',
                        backPassage: latestEnd,
                        distanceInKm: undefined,
                        speed: undefined,
                    },
                    {
                        trackId: '2',
                        trackName: '2',
                        frontArrival: earliestStart,
                        backPassage: '2022-02-02T02:10:00.000Z',
                        distanceInKm: undefined,
                        speed: undefined,
                    },
                ],
                path: undefined,
                paths: [
                    [
                        { lat: 48, lon: 11 },
                        { lat: 48.1, lon: 11.1 },
                        { lat: 48.2, lon: 11.2 },
                    ],
                    [
                        { lat: 48.3, lon: 11.3 },
                        { lat: 48.4, lon: 11.4 },
                    ],
                ],
            } as BlockedStreetInfo,
        ];

        // when
        const blockedStreetInfo = getBlockedStreetInfo({
            trackMerge: { trackCompositions: trackCompositions },
        } as State);

        // then
        expect(blockedStreetInfo).toEqual(expectedBlockedStreets);
    });

    it('keeps streets with unknown postcode and district separate', () => {
        const trackStreetInfos: TrackStreetInfo[] = [
            {
                id: '1',
                wayPoints: [
                    {
                        streetName: 'Unknown Street',
                        postCode: null,
                        district: null,
                        frontArrival: '2022-02-02T02:00:00.000Z',
                        backPassage: '2022-02-02T02:05:00.000Z',
                        type: TrackWayPointType.Track,
                    },
                    {
                        streetName: 'Unknown Street',
                        postCode: undefined,
                        district: undefined,
                        frontArrival: '2022-02-02T02:10:00.000Z',
                        backPassage: '2022-02-02T02:15:00.000Z',
                        type: TrackWayPointType.Track,
                    },
                ],
            },
        ] as TrackStreetInfo[];
        (getTrackStreetInfos as unknown as Mock).mockReturnValue(trackStreetInfos);

        const blockedStreetInfo = getBlockedStreetInfo({
            trackMerge: { trackCompositions: [{ id: '1', peopleCount: 10 }] },
        } as State);

        expect(blockedStreetInfo).toHaveLength(2);
    });

    it('keeps streets with different districts separate', () => {
        const createWaypoint = (district: string): WayPoint => ({
            streetName: 'Main Street',
            postCode: '12345',
            district,
            frontArrival: '2022-02-02T02:00:00.000Z',
            frontPassage: '2022-02-02T02:00:00.000Z',
            backPassage: '2022-02-02T02:05:00.000Z',
            pointFrom: { lat: 48, lon: 11, time: '2022-02-02T02:00:00.000Z' },
            pointTo: { lat: 48.1, lon: 11.1, time: '2022-02-02T02:05:00.000Z' },
            type: TrackWayPointType.Track,
        });
        (getTrackStreetInfos as unknown as Mock).mockReturnValue([
            { id: '1', wayPoints: [createWaypoint('North'), createWaypoint('South')] },
        ] as TrackStreetInfo[]);

        const blockedStreetInfo = getBlockedStreetInfo({
            trackMerge: { trackCompositions: [{ id: '1', peopleCount: 10 }] },
        } as State);

        expect(blockedStreetInfo).toHaveLength(2);
    });

    it('aggregates fully resolved matching streets', () => {
        const createWaypoint = (frontArrival: string): WayPoint => ({
            streetName: 'Main Street',
            postCode: '12345',
            district: 'Central',
            frontArrival,
            frontPassage: frontArrival,
            backPassage: '2022-02-02T02:05:00.000Z',
            pointFrom: { lat: 48, lon: 11, time: frontArrival },
            pointTo: { lat: 48.1, lon: 11.1, time: '2022-02-02T02:05:00.000Z' },
            type: TrackWayPointType.Track,
        });
        (getTrackStreetInfos as unknown as Mock).mockReturnValue([
            {
                id: '1',
                wayPoints: [createWaypoint('2022-02-02T02:00:00.000Z'), createWaypoint('2022-02-02T02:10:00.000Z')],
            },
        ] as TrackStreetInfo[]);

        const blockedStreetInfo = getBlockedStreetInfo({
            trackMerge: { trackCompositions: [{ id: '1', peopleCount: 10 }] },
        } as State);

        expect(blockedStreetInfo).toHaveLength(1);
    });

    it('does not connect or duplicate identical paths from multiple tracks', () => {
        const path = [
            { lat: 48, lon: 11 },
            { lat: 48.1, lon: 11.1 },
            { lat: 48.2, lon: 11.2 },
        ];
        const createWaypoint = (trackId: string): TrackStreetInfo =>
            ({
                id: trackId,
                wayPoints: [
                    {
                        streetName: 'St 2544',
                        postCode: '82110',
                        district: 'District of Furstenfeldbruck',
                        frontArrival: '2022-02-02T02:00:00.000Z',
                        frontPassage: '2022-02-02T02:01:00.000Z',
                        backPassage: '2022-02-02T02:05:00.000Z',
                        pointFrom: { lat: 48, lon: 11, time: '2022-02-02T02:00:00.000Z' },
                        pointTo: { lat: 48.2, lon: 11.2, time: '2022-02-02T02:05:00.000Z' },
                        path,
                        type: TrackWayPointType.Track,
                    },
                ],
            }) as TrackStreetInfo;
        (getTrackStreetInfos as unknown as Mock).mockReturnValue([createWaypoint('1'), createWaypoint('2')]);

        const blockedStreetInfo = getBlockedStreetInfo({
            trackMerge: {
                trackCompositions: [
                    { id: '1', peopleCount: 10 },
                    { id: '2', peopleCount: 20 },
                ],
            },
        } as State);

        expect(blockedStreetInfo).toHaveLength(1);
        expect(blockedStreetInfo[0]?.path).toEqual(path);
        expect(blockedStreetInfo[0]?.paths).toEqual([path]);
    });
});
