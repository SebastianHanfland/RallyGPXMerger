import { isTrackSegment, ParsedGpxSegment, ParsedPoint, TrackComposition } from '../../../store/types.ts';
import { getStreetLookupIndex } from '../helper/getStreetLookupIndex.ts';

export interface RoutePointReference {
    segmentId: string;
    pointIndex: number;
    point: ParsedPoint;
}

export type RangeAssignmentIndex = number | 'unknown-start' | 'unknown-end';

export interface StreetPointAssignment {
    segmentId: string;
    pointIndex: number;
    lookupIndex: RangeAssignmentIndex;
}

export function getRoutePointReferences(track: TrackComposition, segments: ParsedGpxSegment[]): RoutePointReference[] {
    return track.segments
        .slice()
        .reverse()
        .filter(isTrackSegment)
        .flatMap((trackSegment) => {
            const segment = segments.find(
                (candidate) => candidate.id === trackSegment.id || candidate.id === trackSegment.segmentId
            );
            return (
                segment?.points.map((point, pointIndex) => ({
                    segmentId: segment.id,
                    pointIndex,
                    point,
                })) ?? []
            );
        });
}

export function getStreetRange(
    points: RoutePointReference[],
    streetIndex: number
): { start: number; end: number } | null {
    const matchingIndexes = points
        .map((routePoint, index) => (getStreetLookupIndex(routePoint.point) === streetIndex ? index : -1))
        .filter((index) => index >= 0);
    if (matchingIndexes.length === 0) {
        return null;
    }
    return { start: matchingIndexes[0]!, end: matchingIndexes[matchingIndexes.length - 1]! };
}

export function getStreetRangeAssignments(
    points: RoutePointReference[],
    streetIndex: number,
    range: { start: number; end: number },
    boundary: 'start' | 'end',
    selectedPointIndex: number
): StreetPointAssignment[] {
    const assignments: StreetPointAssignment[] = [];
    const addAssignments = (from: number, to: number, lookupIndex: RangeAssignmentIndex) => {
        for (let index = from; index <= to; index++) {
            const routePoint = points[index];
            if (routePoint) {
                assignments.push({
                    segmentId: routePoint.segmentId,
                    pointIndex: routePoint.pointIndex,
                    lookupIndex,
                });
            }
        }
    };

    if (boundary === 'start') {
        addAssignments(selectedPointIndex, range.end, streetIndex);
        if (selectedPointIndex > range.start) {
            addAssignments(
                range.start,
                selectedPointIndex - 1,
                range.start > 0 ? getStreetLookupIndex(points[range.start - 1]!.point) : 'unknown-start'
            );
        }
    } else {
        addAssignments(range.start, selectedPointIndex, streetIndex);
        if (selectedPointIndex < range.end) {
            addAssignments(
                selectedPointIndex + 1,
                range.end,
                range.end < points.length - 1 ? getStreetLookupIndex(points[range.end + 1]!.point) : 'unknown-end'
            );
        }
    }
    return assignments;
}
