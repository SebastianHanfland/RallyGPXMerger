import { describe, expect, it } from 'vitest';
import { SEGMENT, ParsedGpxSegment, ParsedPoint, TrackComposition } from '../../../../store/types.ts';
import { getRoutePointReferences, getStreetRange, getStreetRangeAssignments } from '../streetRangeEditing.ts';

const point = (s: number, m?: number): ParsedPoint => ({ l: 0, b: 0, e: 0, t: 0, s, m });
const segment = (id: string, points: ParsedPoint[]): ParsedGpxSegment => ({ id, filename: id, points });
const track: TrackComposition = {
    id: 'track',
    segments: [
        { id: 'first', segmentId: 'first', type: SEGMENT },
        { id: 'second', segmentId: 'second', type: SEGMENT },
    ],
};

describe('street range editing', () => {
    it('builds route points in track order with stable references', () => {
        const references = getRoutePointReferences(track, [
            segment('first', [point(1)]),
            segment('second', [point(2)]),
        ]);
        expect(references.map((reference) => reference.segmentId)).toEqual(['second', 'first']);
        expect(references.map((reference) => reference.pointIndex)).toEqual([0, 0]);
    });

    it('assigns a shortened start to the street and its removed points to the previous street', () => {
        const points = [2, 1, 1, 2].map((s, pointIndex) => ({ segmentId: 'segment', pointIndex, point: point(s) }));
        const assignments = getStreetRangeAssignments(points, 1, { start: 1, end: 2 }, 'start', 2);
        expect(assignments.map(({ pointIndex, lookupIndex }) => [pointIndex, lookupIndex])).toEqual([
            [2, 1],
            [1, 2],
        ]);
    });

    it('assigns a shortened end to the street and creates an unknown edge section', () => {
        const points = [1, 2, 2].map((s, pointIndex) => ({ segmentId: 'segment', pointIndex, point: point(s) }));
        const assignments = getStreetRangeAssignments(points, 2, { start: 1, end: 2 }, 'end', 1);
        expect(assignments).toEqual([
            { segmentId: 'segment', pointIndex: 1, lookupIndex: 2 },
            { segmentId: 'segment', pointIndex: 2, lookupIndex: 'unknown-end' },
        ]);
    });

    it('finds the effective range when a point has a manual lookup', () => {
        const points = [point(1), point(2, 7), point(2, 7)].map((point, pointIndex) => ({
            segmentId: 'segment',
            pointIndex,
            point,
        }));
        expect(getStreetRange(points, 7)).toEqual({ start: 1, end: 2 });
    });
});
