import { fromKey, toKey } from '../pointKeys.ts';

describe('pointKeys', () => {
    const key1 = 'lat:23.2300000000-lng:34.2300000000';
    it('should create key from lat and lon', () => {
        // when
        const key = toKey({ lat: 23.23, lon: 34.23 });

        // then
        expect(key).toEqual(key1);
    });

    it('should create lat and lng from key', () => {
        // when
        const latLon = fromKey(key1);

        // then
        expect(latLon).toEqual({ lat: 23.23, lon: 34.23 });
    });
});
