import { createSelector } from '@reduxjs/toolkit';
import { filterItems } from '../../utils/filterUtil.ts';
import { calculateDistanceInKm } from '../../common/calculation/aggregated-segments/calculateDistanceInKm.ts';
import { getSegmentInfo, getSegmentSpeed } from '../tracks/segment-selection/getSegmentInfo.ts';
import {
    getParsedGpxSegments,
    getSegmentFilterTerm,
    getSegmentSortDirection,
    getSegmentSortField,
    getShowUnusedSegments,
    getShowUsedSegments,
} from '../store/segmentData.redux.ts';
import { getSegmentUsages } from './segmentUsageCounter.ts';
import { getAggregateStreetsInSegments } from '../../common/calculation/aggregated-segments/aggregatePointsSelector.ts';

export interface SegmentTableRow {
    id: string;
    filename: string;
    flipped?: boolean;
    color?: string;
    distance: number;
    speed: number | undefined;
    info: string | undefined;
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

export interface SegmentCoreData {
    id: string;
    filename: string;
    flipped?: boolean;
    color?: string;
    distance: number;
    speed: number | undefined;
    info: string | undefined;
    used: boolean;
}

export const getSegmentCoreData = createSelector(
    [getParsedGpxSegments, getAggregateStreetsInSegments, getSegmentUsages],
    (segments, aggregatedSegments, segmentUsages): SegmentCoreData[] =>
        segments.map((segment) => {
            const aggregatedInfo = aggregatedSegments[segment.id];
            const speed = getSegmentSpeed(aggregatedInfo);
            return {
                id: segment.id,
                filename: segment.filename,
                flipped: segment.flipped,
                color: segment.color,
                distance: calculateDistanceInKm(segment.points),
                speed,
                info: getSegmentInfo(aggregatedInfo, speed),
                used: (segmentUsages[segment.id]?.counter ?? 0) > 0,
            };
        })
);

export const getSegmentTableRows = createSelector(
    [
        getSegmentCoreData,
        getSegmentFilterTerm,
        getShowUsedSegments,
        getShowUnusedSegments,
        getSegmentSortField,
        getSegmentSortDirection,
    ],
    (coreData, filterTerm, showUsedSegments, showUnusedSegments, sortField, sortDirection): SegmentTableRow[] =>
        filterItems(filterTerm, coreData, (row) => row.filename)
            .filter(({ used }) => (used ? showUsedSegments : showUnusedSegments))
            .sort((first, second) => {
                const firstValue = sortField === 'name' ? first.filename : first[sortField];
                const secondValue = sortField === 'name' ? second.filename : second[sortField];
                const comparison = compareValues(firstValue, secondValue);
                return (
                    (sortDirection === 'ascending' ? comparison : -comparison) ||
                    first.filename.localeCompare(second.filename)
                );
            })
);
