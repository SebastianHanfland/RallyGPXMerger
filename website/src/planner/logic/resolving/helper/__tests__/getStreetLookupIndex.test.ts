import { getStreetLookupIndex } from '../getStreetLookupIndex.ts';

describe('getStreetLookupIndex', () => {
    it('uses s when m is absent', () => {
        expect(getStreetLookupIndex({ s: 12 })).toBe(12);
    });

    it('uses m when present', () => {
        expect(getStreetLookupIndex({ s: 12, m: 34 })).toBe(34);
    });

    it('keeps zero as a valid manual index', () => {
        expect(getStreetLookupIndex({ s: 12, m: 0 })).toBe(0);
    });
});
