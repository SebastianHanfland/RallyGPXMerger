import { calculateDistanceInKm } from '../../common/calculation/aggregated-segments/calculateDistanceInKm.ts';
import { AggregatedPoints } from '../logic/resolving/types.ts';
import { getSegmentSpeed } from '../tracks/segment-selection/getSegmentInfo.ts';
import { ParsedGpxSegment, SegmentSortDirection, SegmentSortField, TrackComposition } from '../store/types.ts';

export interface SegmentTableRow {
    segment: ParsedGpxSegment;
    distance: number;
    speed: number | undefined;
    used: boolean;
}

function compareValues(first: number | string | undefined, second: number | string | undefined): number {
    if (first === undefined && second === undefined) return 0;
    if (first === undefined) return 1;
    if (second === undefined) return -1;
    return typeof first === 'string' && typeof second === 'string'
        ? first.localeCompare(second)
        : Number(first) - Number(second);
}

export function getSegmentTableRows(
    segments: ParsedGpxSegment[],
    aggregatedSegments: Record<string, AggregatedPoints[] | undefined>,
    trackCompositions: TrackComposition[],
    usageFilter: 'all' | 'used' | 'unused',
    sortField: SegmentSortField,
    sortDirection: SegmentSortDirection
): SegmentTableRow[] {
    const usedSegmentIds = new Set(trackCompositions.flatMap((track) => track.segments.map((segment) => segment.id)));
    return segments
        .map((segment) => ({
            segment,
            distance: calculateDistanceInKm(segment.points),
            speed: getSegmentSpeed(aggregatedSegments[segment.id]),
            used: usedSegmentIds.has(segment.id),
        }))
        .filter(({ used }) => usageFilter === 'all' || used === (usageFilter === 'used'))
        .sort((first, second) => {
            const firstValue = sortField === 'name' ? first.segment.filename : first[sortField];
            const secondValue = sortField === 'name' ? second.segment.filename : second[sortField];
            const comparison = compareValues(firstValue, secondValue);
            return (
                (sortDirection === 'ascending' ? comparison : -comparison) ||
                first.segment.filename.localeCompare(second.segment.filename)
            );
        });
}
