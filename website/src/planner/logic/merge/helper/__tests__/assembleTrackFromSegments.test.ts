import { TrackComposition } from '../../../../store/types.ts';
import { Mock } from 'vitest';
import { BREAK_IDENTIFIER, GpxFileAccess } from '../../types.ts';

import { mergeSimpleGPXs, SimpleGPX } from '../../../../../utils/SimpleGPX.ts';
import { assembleTrackFromSegments } from '../assembleTrackFromSegments.ts';
import { CalculatedTrack, GpxSegment } from '../../../../../common/types.ts';

vi.mock('../../../../../utils/SimpleGPX.ts');

describe('assembleTrackFromSegments', () => {
    afterEach(() => {
        vi.clearAllMocks();
        vi.resetAllMocks();
    });

    const arrivalDateTime = '2023-10-17T22:00:00.000Z';

    function createMock(content: string): GpxFileAccess & { content: string } {
        return {
            getStart: () => `start-${content}`,
            toString: () => content,
            shiftToArrivalTime: vi.fn(),
            content,
        };
    }

    // given
    const a1Mock = createMock('cA1');
    const abMock = createMock('cAB');
    const aMock = createMock('cA');

    beforeEach(() => {
        (mergeSimpleGPXs as Mock).mockImplementation((list: GpxFileAccess[]) => {
            if (list.length === 1) {
                return list[0];
            }
            const a = list[0];
            const b = list[1];
            if (a.toString() === a1Mock.toString() && b.toString() === abMock.toString()) {
                return aMock;
            }
            expect({ a: a, b: b }).toBeUndefined();
        });

        (SimpleGPX.fromString as Mock).mockImplementation((content: string): GpxFileAccess => {
            switch (content) {
                case 'cA1':
                    return a1Mock;
                case 'cAB':
                    return abMock;
                default:
                    expect({ content }).toBeUndefined();
            }
            return a1Mock;
        });
    });

    it('merge A1 and AB to A - Ignoring People and Time shift', () => {
        // given
        const gpxSegments: GpxSegment[] = [
            { id: '1', filename: 'A1', content: 'cA1' },
            { id: '2', filename: 'B1', content: 'cB1' },
            { id: '3', filename: 'AB', content: 'cAB' },
        ];
        const trackComposition: TrackComposition = { id: '1', name: 'A', segmentIds: ['1', '3'] };

        const expectedCalculatedTrack: CalculatedTrack = { id: '1', filename: 'A', content: 'cA', peopleCount: 0 };

        // when
        const calculatedTracks = assembleTrackFromSegments(trackComposition, gpxSegments, arrivalDateTime);

        // then
        expect(calculatedTracks).toEqual(expectedCalculatedTrack);
    });

    it('should set arrival date for one segment - one track', () => {
        // given
        const gpxSegments: GpxSegment[] = [{ id: '1', filename: 'A1', content: 'cA1' }];
        const track: TrackComposition = { id: '1', name: 'A', segmentIds: ['1'] };

        const expectedCalculatedTracks: CalculatedTrack = { id: '1', filename: 'A', content: 'cA1', peopleCount: 0 };

        // when
        const calculatedTrack = assembleTrackFromSegments(track, gpxSegments, arrivalDateTime);

        // then
        expect(a1Mock.shiftToArrivalTime).toHaveBeenCalledWith(arrivalDateTime);
        expect(calculatedTrack).toEqual(expectedCalculatedTracks);
    });

    it('should set arrival date for two segments - one track', () => {
        // given
        const gpxSegments: GpxSegment[] = [
            { id: '1', filename: 'A1', content: 'cA1' },
            { id: '2', filename: 'AB', content: 'cAB' },
        ];
        const track: TrackComposition = { id: '1', name: 'A', segmentIds: ['1', '2'] };

        const expectedCalculatedTrack: CalculatedTrack = { id: '1', filename: 'A', content: 'cA', peopleCount: 0 };

        // when
        const calculatedTrack = assembleTrackFromSegments(track, gpxSegments, arrivalDateTime);

        // then
        expect(a1Mock.shiftToArrivalTime).toHaveBeenCalledWith(abMock.getStart());
        expect(abMock.shiftToArrivalTime).toHaveBeenCalledWith(arrivalDateTime);
        expect(calculatedTrack).toEqual(expectedCalculatedTrack);
    });

    it('should set arrival date for one segment and one break - one track', () => {
        // given
        const gpxSegments: GpxSegment[] = [{ id: '1', filename: 'A1', content: 'cA1' }];
        const track: TrackComposition = { id: '1', name: 'A', segmentIds: ['1', `30${BREAK_IDENTIFIER}1`] };
        const arrivalDateTime30min = '2023-10-17T21:30:00.000Z';

        const expectedCalculatedTrack: CalculatedTrack = { id: '1', filename: 'A', content: 'cA1', peopleCount: 0 };

        // when
        const calculatedTracks = assembleTrackFromSegments(track, gpxSegments, arrivalDateTime);

        // then
        expect(a1Mock.shiftToArrivalTime).toHaveBeenCalledWith(arrivalDateTime30min);
        expect(calculatedTracks).toEqual(expectedCalculatedTrack);
    });
});
