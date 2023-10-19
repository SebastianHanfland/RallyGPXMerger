import { mergeTracks } from '../primitiveSolver.ts';
import { CalculatedTrack, GpxSegment, TrackComposition } from '../../../store/types.ts';
import { mergeGpxs } from '../../gpxMerger.ts';
import { Mock } from 'vitest';
import { letTimeInGpxEndAt } from '../../gpxTimeShifter.ts';
import { getStartTimeOfGpxTrack } from '../../startTimeExtractor.ts';

vi.mock('../../gpxMerger.ts');
vi.mock('../../gpxTimeShifter.ts');
vi.mock('../../startTimeExtractor.ts');

describe('primitiveSolver', () => {
    it('merge A1 and AB to A and B1 and AB to B', () => {
        // given
        const gpxSegments: GpxSegment[] = [
            { id: '1', filename: 'A1', content: 'cA1', peopleCountStart: 1, peopleCountEnd: 1 },
            { id: '2', filename: 'B1', content: 'cB1', peopleCountStart: 1, peopleCountEnd: 1 },
            { id: '3', filename: 'AB', content: 'cAB', peopleCountStart: 2, peopleCountEnd: 2 },
        ];
        const trackCompositions: TrackComposition[] = [
            { id: '1', name: 'A', segmentIds: ['1', '3'] },
            { id: '2', name: 'B', segmentIds: ['2', '3'] },
        ];
        const arrivalDateTime = '2023-10-17T22:00:00.000Z';

        const expectedCalculatedTracks: CalculatedTrack[] = [
            { id: '1', filename: 'A', content: 'cA' },
            { id: '2', filename: 'B', content: 'cB' },
        ];
        (mergeGpxs as Mock).mockImplementation((a: string, b: string) => {
            if (a === 'cA1' && b === 'cAB') {
                return 'cA';
            }
            if (a === 'cB1' && b === 'cAB') {
                return 'cB';
            }
            expect({ a, b }).toBeUndefined();
        });

        // when
        const calculatedTracks = mergeTracks(gpxSegments, trackCompositions, arrivalDateTime);

        // then
        expect(calculatedTracks).toEqual(expectedCalculatedTracks);
    });

    it('should set arrival date for one segment - one track', () => {
        // given
        const gpxSegments: GpxSegment[] = [{ id: '1', filename: 'A1', content: 'cA' }];
        const trackCompositions: TrackComposition[] = [{ id: '1', name: 'A', segmentIds: ['1'] }];
        const arrivalDateTime = '2023-10-17T22:00:00.000Z';

        const expectedCalculatedTracks: CalculatedTrack[] = [{ id: '1', filename: 'A', content: 'cA-shifted' }];

        (letTimeInGpxEndAt as Mock).mockImplementation((content: string, date: string) => {
            if (content === 'cA' && date === arrivalDateTime) {
                return 'cA-shifted';
            }
            expect({ content, date }).toBeUndefined();
        });

        // when
        const calculatedTracks = mergeTracks(gpxSegments, trackCompositions, arrivalDateTime);

        // then
        expect(calculatedTracks).toEqual(expectedCalculatedTracks);
    });

    it('should set arrival date for two segments - one track', () => {
        // given
        const gpxSegments: GpxSegment[] = [
            { id: '1', filename: 'A1', content: 'cA1' },
            { id: '2', filename: 'A2', content: 'cA2' },
        ];
        const trackCompositions: TrackComposition[] = [{ id: '1', name: 'A', segmentIds: ['1', '2'] }];
        const arrivalDateTime = '2023-10-17T22:00:00.000Z';

        const expectedCalculatedTracks: CalculatedTrack[] = [
            { id: '1', filename: 'A', content: 'cA-shifted-and-merged' },
        ];

        (letTimeInGpxEndAt as Mock).mockImplementation((content: string, date: string) => {
            if (content === 'cA1' && date === 'start-cA2-shifted') {
                return 'cA1-shifted';
            }
            if (content === 'cA2' && date === arrivalDateTime) {
                return 'cA2-shifted';
            }
            expect({ content, date }).toBeUndefined();
        });
        (getStartTimeOfGpxTrack as Mock).mockImplementation((content: string) => {
            switch (content) {
                case 'cA1':
                    return 'start-cA1';
                case 'cA2':
                    return 'start-cA2';
                case 'cA2-shifted':
                    return 'start-cA2-shifted';
                default:
                    expect({ content, date }).toBeUndefined();
            }
        });
        (mergeGpxs as Mock).mockImplementation((a: string, b: string) => {
            if (a === 'cA1-shifted' && b === 'cA2-shifted') {
                return 'cA-shifted-and-merged';
            }
            expect({ a, b }).toBeUndefined();
        });

        // when
        const calculatedTracks = mergeTracks(gpxSegments, trackCompositions, arrivalDateTime);

        // then
        expect(calculatedTracks).toEqual(expectedCalculatedTracks);
    });
});
