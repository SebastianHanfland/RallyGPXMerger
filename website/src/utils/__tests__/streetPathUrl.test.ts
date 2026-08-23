import {
    createStreetPathUrl,
    createStreetPointUrl,
    decodeStreetPath,
    STREET_PATH_URL_LIMIT,
} from '../streetPathUrl.ts';

describe('street path URLs', () => {
    it('round-trips exact geometry and the street name when the URL fits', () => {
        const path = [
            { lat: 48.12345, lon: 11.54321 },
            { lat: 48.12355, lon: 11.54421 },
            { lat: 48.12455, lon: 11.54521 },
        ];

        const url = new URL(createStreetPathUrl(path, 'Äußere Straße & Weg?'));

        expect(url.searchParams.get('streetname')).toBe('Äußere Straße & Weg?');
        expect(decodeStreetPath(url.searchParams.get('streetpath')!)).toEqual(path);
    });

    it('simplifies oversized geometry within the URL budget and preserves endpoints', () => {
        const path = Array.from({ length: 2_000 }, (_, index) => ({
            lat: 48 + index / 100_000,
            lon: 11 + Math.sin(index / 5) / 10_000,
        }));

        const urlString = createStreetPathUrl(path, 'A long street');
        const simplified = decodeStreetPath(new URL(urlString).searchParams.get('streetpath')!)!;

        expect(urlString.length).toBeLessThanOrEqual(STREET_PATH_URL_LIMIT);
        expect(simplified.length).toBeLessThan(path.length);
        expect(simplified[0]).toEqual(path[0]);
        expect(simplified[simplified.length - 1]).toEqual({
            lat: Number(path[path.length - 1]!.lat.toFixed(5)),
            lon: Number(path[path.length - 1]!.lon.toFixed(5)),
        });
    });

    it('rejects empty and out-of-range paths', () => {
        expect(decodeStreetPath('')).toBeUndefined();
        const invalidUrl = new URL(createStreetPathUrl([{ lat: 100, lon: 200 }]));
        expect(decodeStreetPath(invalidUrl.searchParams.get('streetpath')!)).toBeUndefined();
    });

    it('creates a named single-location URL', () => {
        const url = new URL(createStreetPointUrl({ lat: 48.12345, lon: 11.54321 }, 'Meeting point'));

        expect(url.searchParams.get('streetname')).toBe('Meeting point');
        expect(decodeStreetPath(url.searchParams.get('streetpath')!)).toEqual([{ lat: 48.12345, lon: 11.54321 }]);
    });
});
