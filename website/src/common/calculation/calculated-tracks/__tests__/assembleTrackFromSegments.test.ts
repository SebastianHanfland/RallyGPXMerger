import { assembleTrackFromSegments } from '../assembleTrackFromSegments.ts';
import {
    BREAK,
    ParsedGpxSegment,
    ParsedPoint,
    SEGMENT,
    TrackBreak,
    TrackComposition,
    TrackSegment,
} from '../../../../planner/store/types.ts';
import { CalculatedTrack2 } from '../../../types.ts';

function getPoint(lat: number, time: number): ParsedPoint {
    return { s: -1, t: time, e: 0, b: lat, l: 0 };
}
function getSegment(id: string): TrackSegment {
    return { type: SEGMENT, segmentId: id, id };
}
function getBreak(minutes: number): TrackBreak {
    return { type: BREAK, minutes, id: `${minutes}`, description: '', hasToilet: false };
}

describe('assembleTrackFromSegments', () => {
    const gpxSegments: ParsedGpxSegment[] = [
        { id: '1', filename: 'A1', points: [getPoint(1, 0), getPoint(2, 10)], streetsResolved: false },
        { id: '2', filename: 'B1', points: [getPoint(3, 0), getPoint(4, 5)], streetsResolved: false },
        { id: '3', filename: 'AB', points: [getPoint(5, 0), getPoint(6, 20)], streetsResolved: false },
    ];

    it('merge A1 and AB to A - Ignoring People and Time shift', () => {
        // given
        const trackComposition: TrackComposition = {
            id: '1',
            name: 'A',
            segments: [getSegment('1'), getSegment('3')],
            peopleCount: 0,
        };

        const expectedCalculatedTrack: CalculatedTrack2 = {
            id: '1',
            filename: 'A',
            points: [getPoint(1, -30), getPoint(2, -20), getPoint(5, -20), getPoint(6, 0)],
            peopleCount: 0,
        };

        // when
        const calculatedTracks = assembleTrackFromSegments(trackComposition, gpxSegments);

        // then
        expect(calculatedTracks).toEqual(expectedCalculatedTrack);
    });

    it('should set arrival date for one segment - one track', () => {
        // given
        const track: TrackComposition = { id: '1', name: 'A', segments: [getSegment('1')], delayAtEndInSeconds: 45 };

        const expectedCalculatedTracks: CalculatedTrack2 = {
            id: '1',
            filename: 'A',
            points: [getPoint(1, -55), getPoint(2, -45)],
            peopleCount: 0,
        };

        // when
        const calculatedTrack = assembleTrackFromSegments(track, gpxSegments);

        // then
        expect(calculatedTrack).toEqual(expectedCalculatedTracks);
    });

    it('should set arrival date for one segment and one break - one track', () => {
        // given
        const track: TrackComposition = {
            id: '1',
            name: 'A',
            segments: [getSegment('1'), getBreak(2), getSegment('2')],
            delayAtEndInSeconds: 5,
        };

        const expectedCalculatedTrack: CalculatedTrack2 = {
            id: '1',
            filename: 'A',
            points: [getPoint(1, -140), getPoint(2, -130), getPoint(3, -10), getPoint(4, -5)],
            peopleCount: 0,
        };

        // when
        const calculatedTracks = assembleTrackFromSegments(track, gpxSegments);

        // then
        expect(calculatedTracks).toEqual(expectedCalculatedTrack);
    });
});
