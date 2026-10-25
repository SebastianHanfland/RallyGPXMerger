import { SegmentDataState } from './types';

export function getHighestStreetLookupIndex(state: SegmentDataState): number {
    const lookupIndexes = [state.streetLookup, state.postCodeLookup, state.districtLookup]
        .flatMap((lookup) => Object.keys(lookup))
        .map(Number)
        .filter(Number.isFinite);
    const manualIndexes = state.segments.flatMap((segment) =>
        segment.points
            .flatMap((point) => [point.r, point.s, point.m])
            .filter((index): index is number => index !== undefined)
    );
    return Math.max(state.streetLookupIndex ?? 0, ...lookupIndexes, ...manualIndexes, 0);
}

export function keepLookupIndexes(lookup: Record<number, string | undefined>, indexesToKeep: Set<number>) {
    return Object.fromEntries(Object.entries(lookup).filter(([index]) => indexesToKeep.has(Number(index)))) as Record<
        number,
        string | undefined
    >;
}
