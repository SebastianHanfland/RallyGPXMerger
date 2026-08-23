import { getStreetPathDirection } from '../getStreetPathDirection.ts';

describe('getStreetPathDirection', () => {
    it('places an eastbound indicator at the distance midpoint', () => {
        const direction = getStreetPathDirection([
            { lat: 0, lon: 0 },
            { lat: 0, lon: 0.5 },
            { lat: 0, lon: 2 },
        ]);

        expect(direction?.position.lat).toBeCloseTo(0);
        expect(direction?.position.lon).toBeCloseTo(1);
        expect(direction?.bearing).toBeCloseTo(90);
    });

    it('returns no indicator when the path has no direction', () => {
        expect(getStreetPathDirection([{ lat: 48, lon: 11 }])).toBeUndefined();
        expect(
            getStreetPathDirection([
                { lat: 48, lon: 11 },
                { lat: 48, lon: 11 },
            ])
        ).toBeUndefined();
    });
});
