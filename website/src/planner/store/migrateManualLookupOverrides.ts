import { getStreetLookupIndex } from '../logic/resolving/helper/getStreetLookupIndex.ts';
import { ManualLookupField, SegmentDataState } from './types.ts';

type SegmentDataWithLegacyOverrides = SegmentDataState & {
    replaceStreetLookup?: Record<number, string | undefined>;
    replacePostCodeLookup?: Record<number, string | undefined>;
    replaceDistrictLookup?: Record<number, string | undefined>;
};

const legacyFields: { field: ManualLookupField; property: keyof SegmentDataWithLegacyOverrides }[] = [
    { field: 'street', property: 'replaceStreetLookup' },
    { field: 'postCode', property: 'replacePostCodeLookup' },
    { field: 'district', property: 'replaceDistrictLookup' },
];

function getLegacyLookup(
    segmentData: SegmentDataWithLegacyOverrides,
    field: ManualLookupField
): Record<number, string | undefined> {
    const property = legacyFields.find((entry) => entry.field === field)!.property;
    return (segmentData[property] as Record<number, string | undefined> | undefined) ?? {};
}

export function migrateManualLookupOverrides(segmentData: SegmentDataState | undefined): SegmentDataState | undefined {
    if (!segmentData) {
        return undefined;
    }

    const legacySegmentData = segmentData as SegmentDataWithLegacyOverrides;
    const legacyIndexes = new Set(
        legacyFields.flatMap(({ field }) => Object.keys(getLegacyLookup(legacySegmentData, field)).map(Number))
    );
    const {
        replaceStreetLookup: _replaceStreetLookup,
        replacePostCodeLookup: _replacePostCodeLookup,
        replaceDistrictLookup: _replaceDistrictLookup,
        ...withoutLegacyOverrides
    } = legacySegmentData;

    if (legacyIndexes.size === 0) {
        return withoutLegacyOverrides;
    }

    let nextIndex = Math.max(
        legacySegmentData.streetLookupIndex ?? 0,
        ...Object.keys(legacySegmentData.streetLookup).map(Number),
        ...Object.keys(legacySegmentData.postCodeLookup).map(Number),
        ...Object.keys(legacySegmentData.districtLookup).map(Number),
        ...legacySegmentData.segments.flatMap((segment) => segment.points.map((point) => getStreetLookupIndex(point)))
    );

    let segments = legacySegmentData.segments;
    const streetLookup = { ...legacySegmentData.streetLookup };
    const postCodeLookup = { ...legacySegmentData.postCodeLookup };
    const districtLookup = { ...legacySegmentData.districtLookup };

    [...legacyIndexes]
        .sort((a, b) => a - b)
        .forEach((sourceIndex) => {
            const manualIndex = ++nextIndex;
            streetLookup[manualIndex] = streetLookup[sourceIndex];
            postCodeLookup[manualIndex] = postCodeLookup[sourceIndex];
            districtLookup[manualIndex] = districtLookup[sourceIndex];

            legacyFields.forEach(({ field }) => {
                const value = getLegacyLookup(legacySegmentData, field)[sourceIndex];
                if (value !== undefined) {
                    if (field === 'street') streetLookup[manualIndex] = value;
                    if (field === 'postCode') postCodeLookup[manualIndex] = value;
                    if (field === 'district') districtLookup[manualIndex] = value;
                }
            });

            segments = segments.map((segment) => ({
                ...segment,
                points: segment.points.map((point) => (point.s === sourceIndex ? { ...point, m: manualIndex } : point)),
            }));
        });

    return {
        ...withoutLegacyOverrides,
        segments,
        streetLookup,
        postCodeLookup,
        districtLookup,
        streetLookupIndex: nextIndex,
    };
}
