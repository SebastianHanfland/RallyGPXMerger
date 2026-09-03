import { describe, expect, it } from 'vitest';
import { getColorFromString } from '../colorUtil.ts';

describe('getColorFromString', () => {
    it('returns a stable valid hex color for a street name', () => {
        const color = getColorFromString('Main Street');

        expect(color).toMatch(/^#[0-9a-f]{6}$/);
        expect(getColorFromString('Main Street')).toBe(color);
    });

    it('generates different colors for different street names', () => {
        expect(getColorFromString('Main Street')).not.toBe(getColorFromString('Oak Avenue'));
    });
});
