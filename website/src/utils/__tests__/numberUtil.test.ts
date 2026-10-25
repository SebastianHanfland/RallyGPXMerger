import { getLanguage, setLanguage } from '../../language.ts';
import { formatFixedNumber } from '../numberUtil.ts';

const initialLanguage = getLanguage();

describe('formatFixedNumber', () => {
    afterEach(() => {
        setLanguage(initialLanguage);
    });

    it('uses a dot and preserves the requested precision in English', () => {
        setLanguage('en');

        expect(formatFixedNumber(12.3, 2)).toBe('12.30');
    });

    it('uses a comma and preserves the requested precision in German', () => {
        setLanguage('de');

        expect(formatFixedNumber(12.3, 2)).toBe('12,30');
    });

    it('rounds to the requested number of fractional digits', () => {
        setLanguage('en');

        expect(formatFixedNumber(12.345, 2)).toBe('12.35');
        expect(formatFixedNumber(12.345, 0)).toBe('12');
    });
});
