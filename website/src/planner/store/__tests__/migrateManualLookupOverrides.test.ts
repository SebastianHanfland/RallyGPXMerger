import { migrateManualLookupOverrides } from '../migrateManualLookupOverrides.ts';
import { SegmentDataState } from '../types.ts';

describe('migrateManualLookupOverrides', () => {
    it('converts legacy replacement rows into point-level manual rows', () => {
        const legacyState = {
            segments: [
                {
                    id: 'segment',
                    filename: 'segment',
                    points: [{ b: 1, l: 1, e: 0, t: 0, s: 4 }],
                },
            ],
            segmentSpeeds: {},
            constructionSegments: [],
            streetLookup: { 4: 'API Street' },
            postCodeLookup: { 4: '12345' },
            districtLookup: { 4: 'API District' },
            streetLookupIndex: 4,
            replaceStreetLookup: { 4: 'Manual Street' },
            replacePostCodeLookup: {},
            replaceDistrictLookup: { 4: 'Manual District' },
        } as SegmentDataState & {
            replaceStreetLookup: Record<number, string>;
            replacePostCodeLookup: Record<number, string>;
            replaceDistrictLookup: Record<number, string>;
        };

        const migrated = migrateManualLookupOverrides(legacyState)!;

        expect(migrated.segments[0]!.points[0]).toEqual({ b: 1, l: 1, e: 0, t: 0, s: 4, m: 5 });
        expect(migrated.streetLookup[5]).toBe('Manual Street');
        expect(migrated.postCodeLookup[5]).toBe('12345');
        expect(migrated.districtLookup[5]).toBe('Manual District');
        expect(migrated).not.toHaveProperty('replaceStreetLookup');
        expect(migrated.streetLookupIndex).toBe(5);
    });
});
